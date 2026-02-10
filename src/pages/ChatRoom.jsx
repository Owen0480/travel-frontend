import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [userInfo, setUserInfo] = useState(null)
    const [connected, setConnected] = useState(false)
    const [inviteCopied, setInviteCopied] = useState(false)
    const messagesEndRef = useRef(null)
    const stompRef = useRef(null)

    const inviteUrl = roomId ? `${window.location.origin}/chat/room/${roomId}` : ''

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        let mounted = true
        const load = async () => {
            try {
                const [userRes, roomRes, msgRes] = await Promise.all([
                    api.get('/v1/users/info'),
                    api.get(`/v1/chat/rooms/${roomId}`),
                    api.get(`/v1/chat/rooms/${roomId}/messages?limit=100`)
                ])
                if (!mounted) return
                const user = userRes.data?.data
                const roomData = roomRes.data?.data
                const msgData = msgRes.data?.data
                setUserInfo(user ? { userId: String(user.userId), fullName: user.fullName || 'User' } : null)
                setRoom(roomData || null)
                setRoomName(roomData?.name || '채팅방')
                setMessages(Array.isArray(msgData) ? msgData : [])
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
        setInput('')
    }

    const copyInvite = () => {
        if (!inviteUrl) return
        navigator.clipboard.writeText(inviteUrl).then(() => {
            setInviteCopied(true)
            setTimeout(() => setInviteCopied(false), 2000)
        })
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

    const myUserId = userInfo?.userId

    return (
        <div className="chat-container">
            <div className="chat-card glass-card">
                <div className="chat-header chat-room-header">
                    <div>
                        <button type="button" className="back-btn" onClick={() => navigate('/chat')}>
                            ← 목록
                        </button>
                        <h2>
                            <input
                                type="text"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                onBlur={renameRoom}
                                onKeyDown={(e) => e.key === 'Enter' && renameRoom()}
                                className="room-name-input"
                                placeholder="채팅방 이름"
                            />
                        </h2>
                    </div>
                    <div className="chat-header-actions">
                        <span className={`status-dot ${connected ? 'online' : 'offline'}`} title={connected ? '연결됨' : '연결 끊김'} />
                        <button type="button" className="invite-btn" onClick={copyInvite}>
                            {inviteCopied ? '복사됨!' : '초대 링크 복사'}
                        </button>
                    </div>
                </div>
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
                <div className="chat-input-area">
                    <input
                        type="text"
                        placeholder={connected ? '메시지를 입력하세요…' : '연결 대기 중…'}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                        disabled={!connected}
                    />
                    <button onClick={send} disabled={!connected || !input.trim()}>
                        전송
                    </button>
                </div>
            </div>
        </div>
    )
}
