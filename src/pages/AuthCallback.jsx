import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

const AuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            const params = new URLSearchParams(location.search);
            const accessToken = params.get('accessToken');
            const refreshToken = params.get('refreshToken');
            const email = params.get('email');

            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
                if (email) localStorage.setItem('email', email);

                // Trigger auth state change for App component
                window.dispatchEvent(new Event('auth-change'));
                navigate('/chat', { replace: true });
            } else {
                console.error('Authentication failed: No token found');
                navigate('/login', { replace: true });
            }
        };

        checkAuth();
    }, [location, navigate]);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🔒</div>
                <h2>Authenticating...</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>잠시만 기다려주세요.</p>
            </div>
        </div>
    );
};

export default AuthCallback;