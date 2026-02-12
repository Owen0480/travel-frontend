import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import api from '../api/axios'
import '../styles/Chat.css'

const WS_URL = `${window.location.protocol === 'https:' ? 'https' : 'http'}://${window.location.hostname}:8080/ws-stomp`

export default function ChatRoom() {
    const { roomId } = useParams()
    const navigate = useNavigate()
    const [room, setRoom] = useState(null)
    const [roomName, setRoomName] = useState('')
    const [rooms, setRooms] = useState([])
    const [messages, setMessages] = useState([])
    const [plans, setPlans] = useState([])
    const [input, setInput] = useState('')
    const [userInfo, setUserInfo] = useState(null)
    const [connected, setConnected] = useState(false)
    const [inviteCopied, setInviteCopied] = useState(false)
    const [planGenerating, setPlanGenerating] = useState(false)
    const [planError, setPlanError] = useState(null)
    const [creating, setCreating] = useState(false)
    const [leaving, setLeaving] = useState(false)
    const messagesEndRef = useRef(null)
    const stompRef = useRef(null)

    const inviteUrl = roomId ? `${window.location.origin}/chat/${roomId}` : ''

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const fetchRooms = async () => {
        try {
            const res = await api.get('/v1/chat/rooms')
            const data = res.data?.data
            setRooms(Array.isArray(data) ? data : [])
        } catch (e) {
            console.error(e)
            setRooms([])
        }
    }

    useEffect(() => {
        let mounted = true
        const loadUser = async () => {
            try {
                const userRes = await api.get('/v1/users/info')
                if (!mounted) return
                const user = userRes.data?.data
                setUserInfo(user ? { userId: String(user.userId), fullName: user.fullName || 'User' } : null)
            } catch (e) {
                console.error(e)
            }
        }
        loadUser()
        fetchRooms()
        return () => { mounted = false }
    }, [])

    useEffect(() => {
        if (!roomId) {
            setRoom(null)
            setRoomName('')
            setMessages([])
            setPlans([])
            return
        }
        let mounted = true
        const load = async () => {
            try {
                const [roomRes, msgRes, plansRes] = await Promise.all([
                    api.get(`/v1/chat/rooms/${roomId}`),
                    api.get(`/v1/chat/rooms/${roomId}/messages?limit=100`),
                    api.get(`/v1/chat/rooms/${roomId}/plans`)
                ])
                if (!mounted) return
                const roomData = roomRes.data?.data
                const msgData = msgRes.data?.data
                const planData = plansRes.data?.data
                setRoom(roomData || null)
                setRoomName(roomData?.name || '채팅방')
                setMessages(Array.isArray(msgData) ? msgData : [])
                setPlans(Array.isArray(planData) ? planData : [])
            } catch (e) {
                console.error(e)
                if (e.response?.status === 404) {
                    navigate('/chat')
                }
            }
        }
        load()
        return () => { mounted = false }
    }, [roomId, navigate])

    useEffect(() => {
        if (!roomId || !userInfo) return
        const socket = new SockJS(WS_URL)
        const client = Stomp.over(socket)
        client.connect(
            {},
            () => {
                setConnected(true)
                client.subscribe(`/topic/chat/room/${roomId}`, (msg) => {
                    try {
                        const body = JSON.parse(msg.body)
                        setMessages((prev) => [...prev, body])
                        if (body.senderUserName === 'PLANNER') {
                            setPlanGenerating(false)
                            if (body.content === 'PLAN_READY') {
                                setPlanError(null)
                                api.get(`/v1/chat/rooms/${roomId}/plans`).then((res) => {
                                    const planData = res.data?.data
                                    setPlans(Array.isArray(planData) ? planData : [])
                                }).catch(() => {})
                            } else {
                                const msg = body.content || ''
                                if (/오류|실패|에러/.test(msg)) {
                                    setPlanError(msg)
                                    setTimeout(() => setPlanError(null), 8000)
                                } else {
                                    setPlanError(null)
                                }
                            }
                        }
                    } catch (_) {}
                })
            },
            () => setConnected(false)
        )
        stompRef.current = client
        return () => {
            if (client.connected) client.disconnect()
            stompRef.current = null
        }
    }, [roomId, userInfo])

    const handlePlanDownload = async (e, p) => {
        if (!p.downloadable || !p.downloadUrl) return
        e.preventDefault()
        try {
            const path = `/v1/chat/rooms/${roomId}/plans/${p.id}/download`
            const res = await api.get(path, { responseType: 'blob' })
            const blob = new Blob([res.data], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = p.fileName || '여행 일정.pdf'
            a.click()
            URL.revokeObjectURL(url)
        } catch (err) {
            console.error(err)
        }
    }

    const isPlanTrigger = (t) => {
        const n = (t || '').replace(/\s+/g, '')
        return /일정생성해줘|일정생성|일정보여줘|일정을짜줘|일정짜줘|일정만들어줘|일정만들어|일정뽑아줘|일정추천해줘|일정추천/.test(n)
    }

    const send = () => {
        const text = input.trim()
        if (!text || !userInfo) return
        const client = stompRef.current
        if (client?.connected) {
            client.send(`/app/chat/room/${roomId}`, {}, JSON.stringify({
                senderUserId: userInfo.userId,
                senderUserName: userInfo.fullName,
                content: text
            }))
        }
        if (isPlanTrigger(text)) {
            setPlanGenerating(true)
            setPlanError(null)
        }
        setInput('')
    }

    // 백엔드·FastAPI 통신에 맞춰 일정 생성 대기 20분
    const PLAN_GENERATE_TIMEOUT_MS = 20 * 60 * 1000
    useEffect(() => {
        if (!planGenerating) return
        const t = setTimeout(() => {
            setPlanGenerating(false)
            setPlanError((prev) => prev || '일정 생성이 지연되고 있습니다. 오류일 수 있으니 잠시 후 다시 시도해 주세요.')
        }, PLAN_GENERATE_TIMEOUT_MS)
        return () => clearTimeout(t)
    }, [planGenerating])

    const copyInvite = () => {
        if (!inviteUrl) return
        navigator.clipboard.writeText(inviteUrl).then(() => {
            setInviteCopied(true)
            setTimeout(() => setInviteCopied(false), 2000)
        })
    }

    const createNewRoom = async () => {
        if (creating) return
        setCreating(true)
        try {
            const res = await api.post('/v1/chat/rooms', { name: '새 채팅방' })
            const newRoom = res.data?.data
            if (newRoom?.id) {
                fetchRooms()
                navigate(`/chat/${newRoom.id}`)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setCreating(false)
        }
    }

    const renameRoom = async () => {
        if (!roomId) return
        const name = roomName.trim() || '채팅방'

        // 변경 없음이면 요청 안 보냄
        if (room && room.name === name) {
            setRoomName(room.name || '채팅방')
            return
        }

        try {
            const res = await api.put(`/v1/chat/rooms/${roomId}`, { name })
            const updated = res.data?.data
            if (updated) {
                setRoom(updated)
                setRoomName(updated.name || '채팅방')
            }
        } catch (e) {
            console.error(e)
            const status = e.response?.status
            if (status === 403) {
                alert('방장만 채팅방 이름을 변경할 수 있습니다.')
            } else {
                const msg = e.response?.data?.message || '채팅방 이름 변경에 실패했습니다.'
                alert(msg)
            }
        }
    }

    const leaveRoom = async () => {
        if (!roomId || leaving) return
        if (!window.confirm('이 채팅방에서 나가시겠습니까?')) return
        setLeaving(true)
        try {
            await api.post(`/v1/chat/rooms/${roomId}/leave`)
            navigate('/chat')
            fetchRooms()
        } catch (e) {
            console.error(e)
            alert(e.response?.data?.message || '채팅방 나가기에 실패했습니다.')
        } finally {
            setLeaving(false)
        }
    }

    const myUserId = userInfo?.userId
    const hasRoom = !!roomId

    return (
        <div className="chat-room-layout travel-ai-layout">
            <aside className="chat-sidebar-left travel-ai-sidebar">
                <div className="travel-ai-sidebar-header">
                    <h1 className="travel-ai-logo">Travel AI</h1>
                    <span className="travel-ai-badge">PREMIUM CONCIERGE</span>
                </div>
                <button
                    type="button"
                    className="travel-ai-btn-new"
                    onClick={createNewRoom}
                    disabled={creating}
                >
                    + 새 채팅방
                </button>
                <div className="travel-ai-section">
                    <h3 className="travel-ai-section-title">RECENT DISCOVERIES</h3>
                    <ul className="chat-sidebar-rooms">
                        {rooms.length === 0 ? (
                            <li className="travel-ai-rooms-empty">대화를 시작해 보세요</li>
                        ) : (
                            rooms.map((r) => (
                                <li key={r.id}>
                                    <Link
                                        to={`/chat/${r.id}`}
                                        className={`chat-sidebar-room-link ${r.id === roomId ? 'active' : ''}`}
                                    >
                                        <span className="travel-ai-room-icon" aria-hidden>🕐</span>
                                        <span className="room-name">{r.name || '채팅방'}</span>
                                    </Link>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
                <div className="travel-ai-card visual-search-card">
                    <h4 className="visual-search-title">Visual Search Pro</h4>
                    <p className="visual-search-desc">사진 한 장으로 여행지를 찾아보세요</p>
                    <Link to="/image-search" className="travel-ai-btn-upgrade">이미지 검색</Link>
                </div>
                <div className="travel-ai-sidebar-footer">
                    <button type="button" className="travel-ai-footer-link" onClick={() => navigate('/mypage')}>
                        <span className="travel-ai-footer-icon" aria-hidden>👤</span>
                        My Page
                    </button>
                    <Link to="/travel-style" className="travel-ai-footer-link">
                        <span className="travel-ai-footer-icon" aria-hidden>📊</span>
                        AI 여행 타입 분석
                    </Link>
                </div>
            </aside>
            <div className="chat-container">
                {!hasRoom ? (
                    <div className="chat-welcome-main">
                        <h2 className="chat-welcome-title">Travel AI Chat</h2>
                        <p className="chat-welcome-desc">새 추천을 만들거나 왼쪽에서 대화를 선택하세요.</p>
                        <button
                            type="button"
                            className="travel-ai-btn-new chat-welcome-btn"
                            onClick={createNewRoom}
                            disabled={creating}
                        >
                            + 새 채팅방
                        </button>
                        {rooms.length > 0 && (
                            <ul className="chat-welcome-rooms">
                                {rooms.map((r) => (
                                    <li key={r.id}>
                                        <Link to={`/chat/${r.id}`} className="chat-welcome-room-link">
                                            <span className="travel-ai-room-icon" aria-hidden>🕐</span>
                                            {r.name || '채팅방'}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ) : (
                    <div className="chat-card glass-card">
                        <div className="chat-header chat-room-header travel-ai-chat-header">
                            <div className="travel-ai-chat-header-left">
                                <h2 className="travel-ai-chat-title">Travel AI Chat</h2>
                                <span className={`travel-ai-status ${connected ? 'active' : ''}`}>
                                    • AI CONCIERGE {connected ? 'ACTIVE' : 'CONNECTING…'}
                                </span>
                                <input
                                    type="text"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    onBlur={renameRoom}
                                    onKeyDown={(e) => e.key === 'Enter' && renameRoom()}
                                    className="room-name-input travel-ai-room-edit"
                                    placeholder="채팅방 이름"
                                />
                            </div>
                            <div className="chat-header-actions travel-ai-header-actions">
                                <span className={`status-dot ${connected ? 'online' : 'offline'}`} title={connected ? '연결됨' : '연결 끊김'} />
                                <button type="button" className="invite-btn" onClick={copyInvite}>
                                    {inviteCopied ? '복사됨!' : '공유'}
                                </button>
                                <button
                                    type="button"
                                    className="chat-leave-btn"
                                    onClick={leaveRoom}
                                    disabled={leaving}
                                >
                                    {leaving ? '나가는 중…' : '나가기'}
                                </button>
                            </div>
                        </div>
                        <div className="chat-main">
                            <div className="chat-messages">
                                {messages.map((m) => (
                                    <div
                                        key={m.id || `${m.createdAt}-${m.senderUserId}-${m.content?.slice(0, 20)}`}
                                        className={`message-wrapper ${m.senderUserId === myUserId ? 'mine' : 'others'}`}
                                    >
                                        <span className="sender">{m.senderUserName || '알 수 없음'}</span>
                                        <div className="message-bubble">
                                            <p className="content">{m.content}</p>
                                        </div>
                                        {m.createdAt && (
                                            <span className="message-time">
                                                {new Date(m.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                        <div className="chat-input-area travel-ai-input-area">
                            <input
                                type="text"
                                placeholder={connected ? 'Tell me more about your travel... (일정이 필요하면 "일정 짜줘" 라고 써보세요)' : '연결 대기 중…'}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                                disabled={!connected}
                            />
                            <button className="travel-ai-send-btn" onClick={send} disabled={!connected || !input.trim()}>
                                Send
                            </button>
                        </div>
                        <footer className="travel-ai-chat-footer">
                            AI TRAVEL DISCOVER • SECURE & ENCRYPTED
                        </footer>
                    </div>
                )}
            </div>
            {/* 채팅창 옆 빈 공간: PDF 목록 (방 선택 시에만) */}
            {hasRoom && (
                <aside className="chat-plans-sidebar">
                    <h3 className="chat-plans-sidebar-title">생성된 일정 PDF</h3>
                    {planGenerating && (
                        <div className="plan-status plan-status-loading" role="status">
                            <span className="plan-status-spinner" aria-hidden />
                            <div className="plan-status-loading-text">
                                <strong>일정 생성 중</strong>
                                <span>잠시만 기다려 주세요 (최대 약 2분)</span>
                            </div>
                        </div>
                    )}
                    {planError && (
                        <div className="plan-status plan-status-error" role="alert">
                            {planError}
                        </div>
                    )}
                    {plans.length === 0 && !planGenerating ? (
                        <p className="plans-empty">아직 생성된 일정이 없습니다.<br />채팅에서 &quot;일정 짜줘&quot;라고 보내보세요.</p>
                    ) : plans.length > 0 ? (
                        <ul className="plan-download-list">
                            {plans.map((p) => (
                                <li key={p.id} className="plan-download-item">
                                    <div className="plan-download-info">
                                        <span className="plan-download-name">{p.fileName || '여행 일정.pdf'}</span>
                                        {p.createdAt && (
                                            <span className="plan-time">
                                                {new Date(p.createdAt).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                    {p.downloadable && p.downloadUrl ? (
                                        <button
                                            type="button"
                                            className="plan-download-btn"
                                            onClick={(e) => handlePlanDownload(e, p)}
                                        >
                                            PDF 다운로드
                                        </button>
                                    ) : (
                                        <span className="plan-expired" title="다운로드 가능 기간(7일)이 지났습니다.">
                                            기간 만료
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </aside>
            )}
        </div>
    )
}
