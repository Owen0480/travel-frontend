import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from './api/axios';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('email', response.data.email);
            window.location.href = '/'; // Redirect to home
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 404) {
                setError('존재하지 않는 회원이거나 비밀번호가 틀렸습니다. 회원가입 하시겠습니까?');
            } else {
                setError('로그인 중 오류가 발생했습니다.');
            }
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <div className="login-container">
            <div className="login-card glass-card">
                <h1>Welcome Back</h1>
                <p className="subtitle">Please enter your details</p>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary">Sign In</button>

                    {error && (
                        <div className="error-message">
                            {error}
                            <br />
                            <Link to="/register" style={{ color: '#6366f1', textDecoration: 'underline' }}>회원가입 하기</Link>
                        </div>
                    )}
                </form>

                <div className="divider">
                    <span>OR</span>
                </div>

                <button onClick={handleGoogleLogin} className="btn-secondary google-btn">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" height="18" style={{ marginRight: '10px' }} />
                    Continue with Google
                </button>

                <p className="footer-text">
                    Don't have an account? <Link to="/register">Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
