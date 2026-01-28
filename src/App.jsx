import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import AuthCallback from './AuthCallback'
import Home from './Home'
import Chat from './Chat'
import api from './api/axios'

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
    const [isLoading, setIsLoading] = useState(true);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (!isInitialMount.current) return;
        isInitialMount.current = false;

        const checkAuth = async () => {
            const hasAccessToken = !!localStorage.getItem('accessToken');
            const isLoginPage = window.location.pathname === '/login';

            if (!hasAccessToken && !isLoginPage) {
                try {
                    // Access Token이 없으면 항상 Refresh Token(쿠키)으로 재발급 시도
                    const response = await api.post('/auth/refresh');
                    localStorage.setItem('accessToken', response.data.accessToken);
                    if (response.data.email) localStorage.setItem('email', response.data.email);
                    setIsAuthenticated(true);
                } catch (err) {
                    console.log('No valid session found');
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        };

        checkAuth();

        const handleAuthChange = () => {
            setIsAuthenticated(!!localStorage.getItem('accessToken'));
        };

        window.addEventListener('auth-change', handleAuthChange);
        return () => window.removeEventListener('auth-change', handleAuthChange);
    }, []);

    if (isLoading) {
        return (
            <div className="login-container">
                <div className="login-card glass-card" style={{ textAlign: 'center' }}>
                    <h2>Loading...</h2>
                    <div className="status-dot online" style={{ margin: '20px auto' }}></div>
                </div>
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            <Route
                path="/"
                element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
            />
            <Route
                path="/chat"
                element={isAuthenticated ? <Chat /> : <Navigate to="/login" replace />}
            />

            {/* 잘못된 경로나 중복 정의 방지: 모든 정의되지 않은 경로는 홈으로 */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}

export default App
