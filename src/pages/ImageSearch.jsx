import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ImageSearch = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState([]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResults([]);
        }
    };

    const analyzeImage = () => {
        if (!selectedImage) return;
        setIsAnalyzing(true);

        // Mock API call
        setTimeout(() => {
            setIsAnalyzing(false);
            setResults([
                { id: 1, name: '스위스 알프스', match: '98%', location: 'Swiss • Mountain', desc: '비슷한 설산과 맑은 호수가 있는 스위스 알프스입니다.', img: 'https://images.unsplash.com/photo-1531219432768-9f540ce91ef3?auto=format&fit=crop&w=500' },
                { id: 2, name: '홋카이도 비에이', match: '85%', location: 'Japan • Snow', desc: '눈 덮인 고요한 분위기가 닮은 홋카이도 비에이입니다.', img: 'https://images.unsplash.com/photo-1542640244-7e672d6cef21?auto=format&fit=crop&w=500' },
                { id: 3, name: '제주도 한라산', match: '72%', location: 'Korea • Mountain', desc: '한국의 아름다운 설경을 자랑하는 한라산입니다.', img: 'https://images.unsplash.com/photo-1549467793-ee6a17b88496?auto=format&fit=crop&w=500' },
                { id: 4, name: '오스트리아 할슈타트', match: '68%', location: 'Austria • Lake', desc: '호수와 산이 어우러진 동화 같은 마을입니다.', img: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=500' }
            ]);
        }, 2000);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#0d161b] dark:text-slate-50 min-h-screen font-display">
            <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">

                    {/* Top Navigation Bar from imageSeaching.html */}
                    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7eef3] dark:border-b-slate-800 px-10 py-3 bg-white dark:bg-background-dark sticky top-0 z-50">
                        <div className="flex items-center gap-8">
                            <Link to="/chat" className="flex items-center gap-4 text-primary">
                                <div className="size-6">
                                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_6_319)">
                                            <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_6_319"><rect fill="white" height="48" width="48"></rect></clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <h2 className="text-[#0d161b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">TravelAI</h2>
                            </Link>
                            <label className="flex flex-col min-w-40 !h-10 max-w-64">
                                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                                    <div className="text-[#4c799a] flex border-none bg-[#e7eef3] dark:bg-slate-800 items-center justify-center pl-4 rounded-l-lg border-r-0">
                                        <span className="material-symbols-outlined text-xl">search</span>
                                    </div>
                                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d161b] dark:text-white focus:outline-0 focus:ring-0 border-none bg-[#e7eef3] dark:bg-slate-800 focus:border-none h-full placeholder:text-[#4c799a] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" placeholder="Quick search..." defaultValue="" />
                                </div>
                            </label>
                        </div>
                        <div className="flex flex-1 justify-end gap-8">
                            <div className="flex items-center gap-9">
                                <Link to="/image-search" className="text-[#0d161b] dark:text-slate-200 text-sm font-medium leading-normal hover:text-primary transition-colors">Discover</Link>
                                <Link to="/chat" className="text-[#0d161b] dark:text-slate-200 text-sm font-medium leading-normal hover:text-primary transition-colors">Chat</Link>
                                <Link to="/mypage" className="text-[#0d161b] dark:text-slate-200 text-sm font-medium leading-normal hover:text-primary transition-colors">My Trips</Link>
                            </div>
                            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-slate-50 text-sm font-bold leading-normal tracking-[0.015em]">
                                <span className="truncate">New Search</span>
                            </button>
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-[#e7eef3] dark:border-slate-700" data-alt="User profile avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDzOCobHznAkO3GkA5vpTX1WSVDEw4WgGxtl6rZg_NfeEOv24SSR6qKdO9aKtaf3kqHuaV86q9KhDj1dOF5ekGW-Ceka4seI9MFOnqtVb4Yrqh-2GZoiSAk6bmc4qIsQKc2zIeDZ-h2mHLRbX1EeMF1cPQoqpAMqmdPnmrkUQcl3i7dxk6x0ABiVbwLPx5_9l0h0a8D5zpSs0w_-nENTIe1Yg3kk9082-aOGT8bEb49rQL0unfCJqbGuHJzzYu4QQrD1xeLJLc4Gqw")' }}></div>
                        </div>
                    </header>

                    <main className="flex-1 flex justify-center py-8">
                        <div className="layout-content-container flex flex-col max-w-[1100px] flex-1 px-4">

                            {/* Upload Hero Zone */}
                            <div className="flex flex-col mb-10">
                                <div className={`flex flex-col items-center gap-6 rounded-xl border-2 border-dashed ${selectedImage ? 'border-primary bg-primary/5' : 'border-primary/40 bg-white dark:bg-slate-800/50'} px-6 py-14 hover:border-primary hover:bg-primary/5 transition-all`}>

                                    {previewUrl ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-64 h-64 rounded-xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-700">
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex gap-3">
                                                <label className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-[#e7eef3] dark:bg-slate-700 text-[#0d161b] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                                    <span className="truncate">다른 사진 선택</span>
                                                    <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                                                </label>
                                                <button
                                                    onClick={analyzeImage}
                                                    disabled={isAnalyzing}
                                                    className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-600 transition-colors disabled:opacity-50"
                                                >
                                                    <span className="truncate">{isAnalyzing ? '분석 중...' : '매칭 여행지 찾기'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex max-w-[480px] flex-col items-center gap-3">
                                                <span className="material-symbols-outlined text-primary text-5xl">cloud_upload</span>
                                                <p className="text-[#0d161b] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] text-center">
                                                    여행의 영감을 업로드하세요
                                                </p>
                                                <p className="text-[#4c799a] text-base font-normal leading-normal max-w-[480px] text-center">
                                                    풍경, 도시, 해변 등 마음에 드는 사진을 올려주시면<br />AI가 색감과 분위기를 분석해 전 세계의 비슷한 여행지를 찾아드립니다.
                                                </p>
                                            </div>
                                            <div className="flex gap-3">
                                                <label className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-600 transition-colors">
                                                    <span className="truncate">사진 선택하기</span>
                                                    <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                                                </label>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Results Section */}
                            {results.length > 0 && (
                                <>
                                    {/* Page Heading with Match Info */}
                                    <div className="flex flex-wrap items-end justify-between gap-4 mb-6 animate-fade-in">
                                        <div className="flex min-w-72 flex-col gap-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <div className="w-12 h-12 rounded-lg bg-cover bg-center border-2 border-primary" style={{ backgroundImage: `url('${previewUrl}')` }}></div>
                                                <span className="text-xs font-bold uppercase tracking-wider text-primary">Inspiration Match</span>
                                            </div>
                                            <h1 className="text-[#0d161b] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                                                {results.length}개의 비슷한 여행지 발견
                                            </h1>
                                            <p className="text-[#4c799a] text-base font-normal leading-normal">
                                                AI가 사진의 텍스처, 색상, 분위기를 분석하여 매칭했습니다.
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#e7eef3] dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                                <span className="material-symbols-outlined text-lg">filter_list</span>
                                                필터
                                            </button>
                                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#e7eef3] dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                                <span className="material-symbols-outlined text-lg">sort</span>
                                                관련도순
                                            </button>
                                        </div>
                                    </div>

                                    {/* Destination Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
                                        {results.map((res) => (
                                            <div key={res.id} className="group relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-[#e7eef3] dark:border-slate-700">
                                                <div className="absolute top-3 right-3 z-10">
                                                    <button className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-white hover:text-red-500 transition-all">
                                                        <span className="material-symbols-outlined text-sm">favorite</span>
                                                    </button>
                                                </div>
                                                <div
                                                    className="bg-cover bg-center h-64 flex flex-col justify-end p-4 relative transition-transform duration-700 group-hover:scale-105"
                                                    style={{ backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 50%), url("${res.img}")` }}
                                                >
                                                    <div className="absolute top-3 left-3 px-2 py-1 rounded bg-primary text-white text-[10px] font-bold tracking-widest uppercase shadow-sm">
                                                        {res.match} Match
                                                    </div>
                                                    <h3 className="text-white text-lg font-bold leading-tight drop-shadow-md">{res.name}</h3>
                                                    <p className="text-white/80 text-xs font-medium drop-shadow-sm">{res.location}</p>
                                                </div>
                                                <div className="p-4 flex justify-between items-center bg-white dark:bg-slate-800 relative z-20">
                                                    <button className="text-primary text-sm font-bold hover:underline">상세 보기</button>
                                                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors cursor-pointer">share</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </main>

                    {/* Sticky Compare Action Bar from html */}
                    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none">
                        <button className="pointer-events-auto flex items-center justify-center gap-4 h-14 px-8 bg-primary text-white rounded-full shadow-2xl hover:scale-105 transition-transform active:scale-95">
                            <span className="material-symbols-outlined">compare_arrows</span>
                            <span className="font-bold text-base">선택한 여행지 비교하기</span>
                            <div className="w-px h-6 bg-white/20"></div>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageSearch;
