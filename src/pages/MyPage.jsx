import React from 'react';
import api from '../api/axios';

const MyPage = () => {
    const userEmail = localStorage.getItem('email') || 'User';

    const withdrawAccount = async () => {
        if (window.confirm('정말로 탈퇴하시겠습니까? 모든 정보가 삭제되며 복구할 수 없습니다.')) {
            try {
                await api.delete('/auth/withdraw');
                alert('탈퇴가 완료되었습니다.');
            } catch (err) {
                console.error('Withdrawal failed', err);
                alert('탈퇴 중 오류가 발생했습니다.');
            } finally {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('email');
                window.location.href = '/login';
            }
        }
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '60px 0' }}>
            <div className="glass-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '60px' }}>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                        borderRadius: '50%',
                        margin: '0 auto 25px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                        border: '4px solid var(--glass-border)'
                    }}>👤</div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>My Account</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>{userEmail}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="glass-card" style={{ padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ marginBottom: '5px' }}>Account Status</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Member since 2026</p>
                        </div>
                        <span style={{ padding: '6px 12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>ACTIVE</span>
                    </div>

                    <div className="glass-card" style={{ padding: '30px' }}>
                        <h3 style={{ marginBottom: '15px' }}>Quick Actions</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <button className="btn-secondary" style={{ padding: '15px' }}>View Saved Places</button>
                            <button className="btn-secondary" style={{ padding: '15px' }}>Chat History</button>
                        </div>
                    </div>

                    <div style={{ marginTop: '40px', padding: '30px', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '24px', background: 'rgba(239, 68, 68, 0.03)' }}>
                        <h3 style={{ color: '#f87171', marginBottom: '10px' }}>Danger Zone</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                            계정을 삭제하면 모든 채팅 데이터와 개인 정보가 영구적으로 제거됩니다.
                        </p>
                        <button
                            onClick={withdrawAccount}
                            style={{
                                background: 'transparent',
                                border: '1px solid #f87171',
                                color: '#f87171',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontWeight: '700',
                                width: 'auto'
                            }}
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;
