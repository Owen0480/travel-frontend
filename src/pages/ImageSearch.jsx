import React, { useState } from 'react';

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

        setTimeout(() => {
            setIsAnalyzing(false);
            setResults([
                { id: 1, name: 'Switzerland Alps', match: '98%', desc: '비슷한 설산과 맑은 호수가 있는 스위스 알프스입니다.', img: 'https://images.unsplash.com/photo-1531219432768-9f540ce91ef3?auto=format&fit=crop&w=500' },
                { id: 2, name: 'Hokkaido, Japan', match: '85%', desc: '눈 덮인 고요한 분위기가 닮은 홋카이도 비에이입니다.', img: 'https://images.unsplash.com/photo-1542640244-7e672d6cef21?auto=format&fit=crop&w=500' },
                { id: 3, name: 'Hallasan, Korea', match: '72%', desc: '한국의 아름다운 설경을 자랑하는 한라산입니다.', img: 'https://images.unsplash.com/photo-1549467793-ee6a17b88496?auto=format&fit=crop&w=500' }
            ]);
        }, 2000);
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '40px 0' }}>
            <div className="page-header">
                <h1 style={{ fontSize: '3rem', marginBottom: '15px' }}>Visual Discovery 📸</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    사진 한 장으로 당신의 취향을 찾아드립니다. <br />
                    비슷한 분위기의 아름다운 여행지를 추천받아보세요.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: previewUrl ? '1fr 1fr' : '1fr', gap: '40px', marginTop: '40px' }}>
                {/* Upload Section */}
                <div className="glass-container" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', borderStyle: 'dashed', borderWidth: '2px' }}>
                    {previewUrl ? (
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', marginBottom: '30px' }} />
                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                <label className="btn-secondary" style={{ cursor: 'pointer' }}>
                                    Change Photo
                                    <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                                </label>
                                <button className="btn-primary" onClick={analyzeImage} disabled={isAnalyzing}>
                                    {isAnalyzing ? 'Analyzing Mood...' : 'Analyze Visual Mood ✨'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <label style={{ cursor: 'pointer', textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📤</div>
                            <h3 style={{ marginBottom: '10px' }}>Click to upload an image</h3>
                            <p style={{ color: 'var(--text-muted)' }}>JPG, PNG, WEBP (Max 5MB)</p>
                            <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                        </label>
                    )}
                </div>

                {/* Results Section */}
                {previewUrl && (
                    <div className="glass-container" style={{ padding: '40px', overflowY: 'auto', maxHeight: '600px' }}>
                        <h2 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            Similar Locations {isAnalyzing && <span style={{ fontSize: '1rem', color: 'var(--primary)' }}>(Loading...)</span>}
                        </h2>

                        {!isAnalyzing && results.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                {results.map(res => (
                                    <div key={res.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', gap: '20px' }}>
                                        <img src={res.img} alt={res.name} style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                                        <div style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <h4 style={{ fontSize: '1.2rem' }}>{res.name}</h4>
                                                <span style={{ color: 'var(--primary)', fontWeight: '800' }}>{res.match} Match</span>
                                            </div>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{res.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : !isAnalyzing && (
                            <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-dim)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🕵️</div>
                                <p>분석 시작 버튼을 눌러보세요.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageSearch;
