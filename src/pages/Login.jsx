import React from 'react';

const Login = () => {
    const handleGoogleLogin = () => {
        const backendUrl = `http://${window.location.hostname}:8080`;
        window.location.href = `${backendUrl}/oauth2/authorization/google`;
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorations */}
            <div style={{ position: 'absolute', top: '10%', right: '10%', width: '400px', height: '400px', background: 'var(--primary-glow)', filter: 'blur(120px)', zIndex: -1 }}></div>
            <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: '300px', height: '300px', background: 'var(--accent-glow)', filter: 'blur(100px)', zIndex: -1 }}></div>

            <div className="glass-container animate-fade-in" style={{
                maxWidth: '480px',
                width: '100%',
                padding: '60px 40px',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <div style={{
                    display: 'inline-flex',
                    padding: '16px',
                    background: 'var(--primary)',
                    borderRadius: '20px',
                    marginBottom: '30px',
                    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)'
                }}>
                    <span style={{ fontSize: '2rem' }}>✈️</span>
                </div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', letterSpacing: '-1px' }}>
                    TRAVEL<span className="gradient-text">AI</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '40px' }}>
                    당신의 완벽한 여행을 위한 <br /> 인공지능 플래너
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button onClick={handleGoogleLogin} className="btn-secondary" style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        padding: '16px',
                        background: 'white',
                        color: '#1f2937',
                        border: 'none',
                        fontSize: '1rem'
                    }}>
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" height="20" />
                        Google 계정으로 계속하기
                    </button>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '20px' }}>
                        로그인 시 서비스 이용약관 및 <br /> 개인정보 처리방침에 동의하게 됩니다.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
