import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Home = () => {
    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error('Logout failed', err);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('email');
            window.location.href = '/login';
        }
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '40px 0' }}>
            {/* Hero Section */}
            <header className="page-header" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'var(--primary-glow)', filter: 'blur(80px)', zIndex: -1 }}></div>
                <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>
                    Discover Your Next <br />
                    <span className="gradient-text">Great Adventure</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 40px' }}>
                    AI-powered travel recommendations and visual location discovery.
                    Upload a photo or chat with our AI to find your perfect destination.
                </p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <Link to="/chat" className="btn-primary" style={{ padding: '16px 40px' }}>
                        Start Chatting 🤖
                    </Link>
                    <Link to="/image-search" className="btn-secondary" style={{ padding: '16px 40px' }}>
                        Find by Photo 📸
                    </Link>
                </div>
            </header>

            {/* Features Section */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '80px' }}>
                <div className="glass-container" style={{ padding: '40px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💬</div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Smart Assistant</h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Tell us what you're looking for, and our AI will suggest the best spots based on your mood and preferences.
                    </p>
                </div>

                <div className="glass-container" style={{ padding: '40px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🖼️</div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Visual Search</h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Have a photo of a place you love? Upload it and we'll find locations with similar vibes and aesthetics.
                    </p>
                </div>

                <div className="glass-container" style={{ padding: '40px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🗺️</div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Custom Itineraries</h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Get personalized travel plans that perfectly match your style and schedule.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'center', gap: '80px', padding: '40px' }} className="glass-card">
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white' }}>10k+</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Destinations</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white' }}>98%</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Match Rate</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white' }}>24/7</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>AI Support</div>
                </div>
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <button
                    onClick={async () => {
                        if (window.confirm('정말로 탈퇴하시겠습니까? 구글 연동 및 모든 데이터가 삭제됩니다.')) {
                            try {
                                await api.delete('/auth/withdraw');
                                alert('탈퇴가 완료되었습니다.');
                                localStorage.removeItem('accessToken');
                                localStorage.removeItem('email');
                                window.location.href = '/login';
                            } catch (err) {
                                console.error('Withdrawal failed', err);
                                alert('탈퇴 처리 중 오류가 발생했습니다.');
                            }
                        }
                    }}
                    style={{ background: 'transparent', border: '1px solid #f87171', color: '#f87171', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer' }}
                >
                    Delete Account (Withdraw)
                </button>
            </div>
        </div>
    );
};

export default Home;
