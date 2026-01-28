import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        const email = searchParams.get('email');

        // 🔍 디버깅: URL에서 넘어온 파라미터 확인
        console.log('--- Auth Callback Debug Start ---');
        console.table({
            accessToken: accessToken ? "✅ Received" : "❌ Missing",
            email: email ? email : "⚠️ Not Provided"
        });

        if (accessToken) {
            console.log('➡️ Success Case: 토큰이 확인되어 메인으로 이동합니다.');

            localStorage.setItem('accessToken', accessToken);

            if (email) localStorage.setItem('email', email);

            window.dispatchEvent(new Event('auth-change'));
            window.location.href = "/";
        } else {
            // 🔍 디버깅: 왜 실패했는지 구체적으로 출력
            console.error('➡️ Failure Case: 필수 토큰이 누락되었습니다.');
            if (!accessToken) console.warn('Missing: accessToken');

            navigate('/login', { replace: true });
        }
        console.log('--- Auth Callback Debug End ---');
    }, [searchParams, navigate]);

    return <div>Processing login...</div>;
}

export default AuthCallback;