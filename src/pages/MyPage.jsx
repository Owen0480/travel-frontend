import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const MyPage = () => {
    const [template, setTemplate] = useState('');

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

    useEffect(() => {
        // 1. Fetch HTML template
        fetch('/Mypage.html')
            .then(res => res.text())
            .then(html => setTemplate(html))
            .catch(err => console.error('Failed to load MyPage template', err));

        // 2. Dynamically inject resources needed for the template to keep index.html clean
        const resources = [
            { type: 'script', src: 'https://cdn.tailwindcss.com?plugins=forms,container-queries', id: 'tailwind-cdn' },
            { type: 'link', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap', rel: 'stylesheet' },
            { type: 'link', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap', rel: 'stylesheet' }
        ];

        const elements = resources.map(res => {
            const el = document.createElement(res.type);
            Object.keys(res).forEach(key => {
                if (key !== 'type') el[key] = res[key];
            });
            document.head.appendChild(el);
            return el;
        });

        // 3. Inject Tailwind Config
        const configScript = document.createElement('script');
        configScript.id = 'tailwind-config-mypage';
        configScript.innerHTML = `
            tailwind.config = {
                darkMode: "class",
                theme: {
                    extend: {
                        colors: {
                            "primary": "#1392ec",
                            "background-light": "#f6f7f8",
                            "background-dark": "#101a22",
                        },
                        fontFamily: {
                            "display": ["Plus Jakarta Sans"]
                        }
                    },
                },
            }
        `;
        document.head.appendChild(configScript);

        // 4. Reset global styles that interfere with the template
        const styleReset = document.createElement('style');
        styleReset.id = 'mypage-style-reset';
        styleReset.innerHTML = `
            body {
                background-color: #f6f7f8 !important;
                background-image: none !important;
                color: #0d161b !important;
                font-family: 'Plus Jakarta Sans', sans-serif !important;
            }
            .dark body {
                background-color: #101a22 !important;
                color: #e2e8f0 !important;
            }
        `;
        document.head.appendChild(styleReset);

        // Cleanup on unmount
        return () => {
            elements.forEach(el => {
                if (document.head.contains(el)) document.head.removeChild(el);
            });
            if (document.head.contains(configScript)) document.head.removeChild(configScript);
            if (document.head.contains(styleReset)) document.head.removeChild(styleReset);
        };
    }, []);

    useEffect(() => {
        if (!template) return;

        // Set user info
        const nameEl = document.getElementById('user-name');
        const emailEl = document.getElementById('user-email');
        const email = localStorage.getItem('email') || 'User';

        if (nameEl) nameEl.textContent = email.split('@')[0];
        if (emailEl) emailEl.textContent = email;

        // Attach event listeners
        const logoutBtn = document.getElementById('logout-button');
        const withdrawBtn = document.getElementById('withdraw-button');

        if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
        if (withdrawBtn) withdrawBtn.addEventListener('click', withdrawAccount);

        return () => {
            if (logoutBtn) logoutBtn.removeEventListener('click', handleLogout);
            if (withdrawBtn) withdrawBtn.removeEventListener('click', withdrawAccount);
        };
    }, [template]);

    return (
        <div
            dangerouslySetInnerHTML={{ __html: template }}
        />
    );
};

export default MyPage;
