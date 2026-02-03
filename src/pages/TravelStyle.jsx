/**
 * TravelStyle.jsx - backend-fastapi domain 기준 통일, 전부 한글화
 * GET /travel-style/options → 관심사 옵션 (한국어 키워드)
 * POST /travel-style/analyze { interests: [한국어 3개] }
 */
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Spring Boot에서 FastAPI 결과를 받아 DB 저장 후 반환
const travelStyleApi = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    timeout: 0,  // 타임아웃 없음
});

const PRIMARY = '#1392ec';
const BG_LIGHT = '#f6f7f8';
const TEXT_MAIN = '#0d161b';
const TEXT_MUTED = '#4c799a';

const MAX_SELECT = 3;

// domain fallback (백엔드 미연결 시)
const FALLBACK_OPTIONS = [
    { type: '액티브형', keywords: ['자전거', '등산', '수영', '서핑', '런닝', '트레킹'] },
    { type: '힐링형', keywords: ['카페', '독서', '온천', '스파', '요가', '명상'] },
    { type: '문화형', keywords: ['쇼핑', '미술', '박물관', '공연', '전시', '영화'] },
    { type: '자연형', keywords: ['등산', '캠핑', '낚시', '사진', '별보기', '트레킹'] },
    { type: '미식형', keywords: ['맛집', '요리', '와인', '디저트', '푸드투어', '카페'] },
    { type: '모험형', keywords: ['번지점프', '패러글라이딩', '스쿠버다이빙', '서핑', '암벽등반', '오프로드'] },
    { type: '감성형', keywords: ['카페', '사진', '일몰', '야경', '독서', '음악'] },
];

const TravelStyle = () => {
    const navigate = useNavigate();
    const [options, setOptions] = useState(FALLBACK_OPTIONS);  // 초기값으로 항상 선택지 표시
    const [selected, setSelected] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const resultRef = useRef(null);

    useEffect(() => {
        travelStyleApi.get('/travel-style/options')
            .then(({ data }) => setOptions(data.options?.length ? data.options : FALLBACK_OPTIONS))
            .catch(() => setOptions(FALLBACK_OPTIONS));
    }, []);

    useEffect(() => {
        if (result && resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [result]);

    const allKeywords = options.flatMap((opt) => opt.keywords);
    const uniqueKeywords = [...new Set(allKeywords)];

    const isSelected = (name) => selected.includes(name);
    const isDisabled = (name) => selected.length >= MAX_SELECT && !isSelected(name);

    const toggleInterest = (name) => {
        if (isDisabled(name)) return;
        if (isSelected(name)) {
            setSelected((prev) => prev.filter((s) => s !== name));
        } else if (selected.length < MAX_SELECT) {
            setSelected((prev) => [...prev, name]);
        }
        setResult(null);
        setError(null);
    };

    const handleAnalyze = async () => {
        if (selected.length < MAX_SELECT) {
            alert('관심사를 3개 선택해 주세요.');
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const { data } = await travelStyleApi.post('/travel-style/analyze', { interests: selected });
            setResult(data.analysis);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || '서버 연결에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 16px', background: BG_LIGHT, minHeight: '100vh', color: TEXT_MAIN, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div style={{ maxWidth: 800, width: '100%', background: '#fff', borderRadius: 12, boxShadow: `0 25px 50px -12px rgba(19,146,236,0.08)`, border: `1px solid rgba(19,146,236,0.1)`, overflow: 'hidden', padding: '32px' }}>
                <button
                    type="button"
                    onClick={() => navigate('/chat')}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 18px',
                        marginBottom: 20,
                        background: 'rgba(19,146,236,0.08)',
                        border: `1px solid rgba(19,146,236,0.2)`,
                        borderRadius: 10,
                        color: PRIMARY,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    ← 뒤로가기
                </button>
                <div style={{ padding: '0 0 16px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 12, background: 'rgba(19,146,236,0.1)', borderRadius: '50%', marginBottom: 16, fontSize: 24, color: PRIMARY }}>✈️</div>
                    <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 8, color: TEXT_MAIN, letterSpacing: '-0.02em' }}>
                        여행 타입 분석
                    </h1>
                    <p style={{ color: TEXT_MUTED, fontSize: 16, marginTop: 8 }}>
                        관심사를 3개 선택하면 AI가 여행 스타일과 추천 여행지를 분석합니다
                    </p>
                </div>
                <div style={{ paddingTop: 8, marginTop: 24 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                        {uniqueKeywords.map((name) => (
                            <button
                                key={name}
                                type="button"
                                onClick={() => toggleInterest(name)}
                                disabled={isDisabled(name)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 9999,
                                    border: `2px solid rgba(19,146,236,0.2)`,
                                    background: isSelected(name) ? PRIMARY : 'rgba(19,146,236,0.05)',
                                    color: isSelected(name) ? '#fff' : TEXT_MAIN,
                                    fontSize: 14,
                                    fontWeight: 500,
                                    cursor: isDisabled(name) ? 'not-allowed' : 'pointer',
                                    opacity: isDisabled(name) ? 0.5 : 1,
                                    boxShadow: isSelected(name) ? `0 4px 14px rgba(19,146,236,0.3)` : 'none'
                                }}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                    <div style={{ marginTop: 48, paddingTop: 32, borderTop: `1px solid rgba(19,146,236,0.1)`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                            <span style={{ fontSize: 14, color: TEXT_MUTED }}>선택된 관심사</span>
                            <span style={{ background: 'rgba(19,146,236,0.1)', color: PRIMARY, padding: '4px 12px', borderRadius: 9999, fontSize: 14, fontWeight: 700 }}>
                                {selected.length}/{MAX_SELECT}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={handleAnalyze}
                            disabled={selected.length !== MAX_SELECT || loading}
                            style={{
                                width: '100%',
                                maxWidth: 400,
                                padding: '16px 32px',
                                background: selected.length === MAX_SELECT && !loading ? PRIMARY : 'rgba(19,146,236,0.3)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 12,
                                fontSize: 18,
                                fontWeight: 700,
                                cursor: selected.length === MAX_SELECT && !loading ? 'pointer' : 'not-allowed',
                                opacity: selected.length === MAX_SELECT && !loading ? 1 : 0.6,
                                boxShadow: selected.length === MAX_SELECT && !loading ? `0 8px 20px rgba(19,146,236,0.3)` : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8
                            }}
                        >
                            ✨ 여행 타입 분석하기
                        </button>
                        {error && <p style={{ color: '#e53e3e', marginTop: 12, fontSize: 14 }}>{error}</p>}
                        {result && (
                            <div
                                ref={resultRef}
                                style={{ marginTop: 24, width: '100%', maxWidth: 520, padding: 20, borderRadius: 12, border: `1px solid rgba(19,146,236,0.2)`, background: 'rgba(19,146,236,0.05)', textAlign: 'center' }}
                            >
                                <p style={{ fontSize: 18, fontWeight: 600, color: TEXT_MAIN }}>
                                    {result.matched_type} — {result.user_interests?.join(', ')}
                                </p>
                                <p style={{ fontSize: 14, color: TEXT_MUTED, marginTop: 12 }}>{result.type_info?.description}</p>
                                {result.reason && (
                                    <p style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 12, textAlign: 'left' }}>{result.reason}</p>
                                )}
                                {result.confidence != null && (
                                    <p style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 8 }}>신뢰도: {result.confidence}%</p>
                                )}
                                {result.type_info?.destinations?.length > 0 && (
                                    <div style={{ marginTop: 16, textAlign: 'left' }}>
                                        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: TEXT_MAIN }}>✈️ 추천 여행지</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {result.type_info.destinations.map((d, idx) => (
                                                <div key={idx} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.5)', borderRadius: 10, border: '1px solid rgba(19,146,236,0.15)' }}>
                                                    <span style={{ fontWeight: 600, color: PRIMARY }}>{d.name}</span>
                                                    <span style={{ fontSize: 12, color: TEXT_MUTED, marginLeft: 8 }}>{d.desc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default TravelStyle;
