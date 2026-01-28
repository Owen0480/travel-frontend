import React, { useState, useEffect, useRef } from 'react';
import api from './api/axios';
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const scrollRef = useRef(null);

    const email = localStorage.getItem('email') || 'User';

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput) return;

        // 1. User Message
        const userMsg = {
            sender: email,
            content: messageInput,
            type: 'CHAT'
        };
        setMessages(prev => [...prev, userMsg]);

        const currentInput = messageInput;
        setMessageInput('');

        try {
            // 2. Call Backend API
            // Note: baseURL is /api, so this calls /api/v1/users/success
            await api.get('/v1/users/success');

            // 3. Success Response
            const systemMsg = {
                sender: 'System',
                content: '성공',
                type: 'CHAT'
            };
            setMessages(prev => [...prev, systemMsg]);
        } catch (err) {
            // 4. Error Response
            const systemMsg = {
                sender: 'System',
                content: '오류',
                type: 'CHAT'
            };
            setMessages(prev => [...prev, systemMsg]);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-card glass-card">
                <div className="chat-header">
                    <h2>API Interaction Chat</h2>
                    <div className="status-dot online"></div>
                </div>

                <div className="chat-messages" ref={scrollRef}>
                    {messages.map((msg, index) => (
                        <div key={index} className={`message-wrapper ${msg.sender === email ? 'mine' : 'others'}`}>
                            <div className="message-bubble">
                                <span className="sender">{msg.sender}</span>
                                <p className="content">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {messages.length === 0 && (
                        <p className="system-msg">메시지를 입력하면 서버 응답을 확인할 수 있습니다.</p>
                    )}
                </div>

                <form className="chat-input-area" onSubmit={sendMessage}>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
