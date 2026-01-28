import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from './api/axios'

const Home = () => {
    const [user, setUser] = useState(null);

    const logout = async () => {
        try {
            // 서버에 로그아웃 요청 (HttpOnly Refresh Token 쿠키 삭제)
            await api.post('/auth/logout');
        } catch (err) {
            console.error('Logout failed', err);
        } finally {
            // 로컬 스토리지 데이터 삭제 및 페이지 이동
            localStorage.removeItem('accessToken');
            localStorage.removeItem('email');
            window.location.href = '/login';
        }
    }

    return (
        <div className="login-container">
            <div className="login-card glass-card">
                <h1>Welcome Home</h1>
                <p className="subtitle">You are successfully logged in.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
                    <Link to="/chat" className="btn-primary" style={{ textDecoration: 'none', textAlign: 'center' }}>
                        Go to Community Chat
                    </Link>

                    <button onClick={logout} className="btn-secondary">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}


export default Home