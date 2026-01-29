import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

const Chat = () => {
    const [messages, setMessages] = useState([
        { sender: 'AI', content: '안녕하세요! 당신의 여행 메이트입니다. 어디로 떠나고 싶으신가요?', type: 'BOT' }
    ]);
    const [messageInput, setMessageInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const userMsg = { sender: 'Me', content: messageInput, type: 'USER' };
        setMessages(prev => [...prev, userMsg]);

        const input = messageInput;
        setMessageInput('');
        setIsTyping(true);

        try {
            await api.get('/v1/users/success');

            setTimeout(() => {
                const aiMsg = {
                    sender: 'AI',
                    content: `'${input}'에 대한 멋진 추천 장소들을 찾아보았습니다. 제주도의 푸른 바다가 보이는 카페나 강원도의 고즈넉한 숲속 숙소는 어떠신가요?`,
                    type: 'BOT'
                };
                setMessages(prev => [...prev, aiMsg]);
                setIsTyping(false);
            }, 1000);

        } catch (err) {
            setIsTyping(false);
            setMessages(prev => [...prev, { sender: 'AI', content: '죄송합니다. 요청을 처리하는 중에 문제가 발생했습니다.', type: 'BOT' }]);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
            <div className="glass-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', maxWidth: '900px', margin: '0 auto', width: '100%', position: 'relative' }}>

                {/* Chat Header */}
                <div style={{ padding: '20px 30px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🤖</div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '2px' }}>Travel AI Assistant</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Online</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {messages.map((msg, index) => (
                        <div key={index} style={{
                            alignSelf: msg.type === 'USER' ? 'flex-end' : 'flex-start',
                            maxWidth: '70%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: msg.type === 'USER' ? 'flex-end' : 'flex-start'
                        }}>
                            <div style={{
                                padding: '15px 20px',
                                borderRadius: msg.type === 'USER' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                background: msg.type === 'USER' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                                color: 'white',
                                fontSize: '0.95rem',
                                border: msg.type === 'BOT' ? '1px solid var(--glass-border)' : 'none',
                                boxShadow: msg.type === 'USER' ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none'
                            }}>
                                {msg.content}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '5px', padding: '0 5px' }}>
                                {msg.sender}
                            </span>
                        </div>
                    ))}
                    {isTyping && (
                        <div style={{ alignSelf: 'flex-start', border: '1px solid var(--glass-border)', padding: '15px 25px', borderRadius: '20px' }}>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <div className="dot" style={{ width: '8px', height: '8px', background: 'var(--text-dim)', borderRadius: '50%' }}>...</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={sendMessage} style={{ padding: '25px 30px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '15px' }}>
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="어디로 여행을 떠나고 싶으신가요?"
                        className="input-field"
                        style={{ flex: 1 }}
                    />
                    <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0 25px' }}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
