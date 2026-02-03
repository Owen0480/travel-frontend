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
<<<<<<< HEAD
=======
    if (location.pathname === '/chat' || location.pathname === '/mypage' || location.pathname === '/travel-style') return null;
>>>>>>> mei

    // Users requested to remove the header code.
    return null;
};

export default Navbar;
