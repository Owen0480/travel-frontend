import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../api/axios';

const Navbar = () => {
    const location = useLocation();
    const isAuthenticated = !!localStorage.getItem('accessToken');

    const handleLogout = async () => {
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

    if (!isAuthenticated) return null;

    return (
        <nav className="glass-container" style={{
            margin: '20px auto',
            width: 'calc(100% - 40px)',
            maxWidth: '1100px',
            padding: '12px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: '20px',
            zIndex: 1000
        }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', background: 'var(--primary)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '1.2rem' }}>✈️</span>
                </div>
                <span style={{ fontWeight: '800', fontSize: '1.2rem', color: 'white', letterSpacing: '-0.5px' }}>
                    TRAVEL<span className="gradient-text">AI</span>
                </span>
            </Link>

            <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                <Link to="/" className={location.pathname === '/' ? 'gradient-text' : ''} style={{ textDecoration: 'none', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.95rem' }}>
                    Home
                </Link>
                <Link to="/chat" className={location.pathname === '/chat' ? 'gradient-text' : ''} style={{ textDecoration: 'none', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.95rem' }}>
                    Travel AI Chat
                </Link>
                <Link to="/image-search" className={location.pathname === '/image-search' ? 'gradient-text' : ''} style={{ textDecoration: 'none', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.95rem' }}>
                    Visual Discovery
                </Link>
                <Link to="/mypage" className={location.pathname === '/mypage' ? 'gradient-text' : ''} style={{ textDecoration: 'none', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.95rem' }}>
                    My Page
                </Link>
            </div>

            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.9rem', width: 'auto' }}>
                Logout
            </button>
        </nav>
    );
};

export default Navbar;
