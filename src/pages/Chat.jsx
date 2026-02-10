import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import '../styles/Chat.css'

export default function Chat() {
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [newRoomName, setNewRoomName] = useState('')
    const navigate = useNavigate()

    const fetchRooms = async () => {
        try {
            const res = await api.get('/v1/chat/rooms')
            const data = res.data?.data
            setRooms(Array.isArray(data) ? data : [])
        } catch (e) {
            console.error(e)
            setRooms([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRooms()
    }, [])

    const createRoom = async () => {
        if (creating) return
        setCreating(true)
        try {
            const res = await api.post('/v1/chat/rooms', { name: newRoomName || '새 채팅방' })
            const room = res.data?.data
            if (room?.id) {
                setNewRoomName('')
                navigate(`/chat/room/${room.id}`)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setCreating(false)
        }
    }

    return (
        <div className="chat-container">
            <div className="chat-card glass-card">
                <div className="chat-header">
                    <h2>채팅방</h2>
                </div>
                <div className="chat-rooms-create">
                    <input
                        type="text"
                        placeholder="방 이름 (선택)"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && createRoom()}
                    />
                    <button onClick={createRoom} disabled={creating}>
                        {creating ? '생성 중…' : '방 만들기'}
                    </button>
                </div>
                <div className="chat-rooms-list">
                    {loading ? (
                        <p className="chat-rooms-empty">불러오는 중…</p>
                    ) : rooms.length === 0 ? (
                        <p className="chat-rooms-empty">채팅방이 없습니다. 방을 만들거나 링크로 참여하세요.</p>
                    ) : (
                        <ul>
                            {rooms.map((room) => (
                                <li key={room.id}>
                                    <Link to={`/chat/room/${room.id}`}>
                                        <span className="room-name">{room.name || '채팅방'}</span>
                                        <span className="room-meta">
                                            {room.createdByUserName} · {room.createdAt ? new Date(room.createdAt).toLocaleDateString() : ''}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}
