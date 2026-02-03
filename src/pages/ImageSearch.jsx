import React from 'react';

const ImageSearch = () => {
    return (
        <div style={{ width: '100%', height: 'calc(100vh - 100px)' }}>
            <iframe
                src="/imageSeaching.html"
                style={{ width: '100%', height: '100%', border: 'none' }}
            />
        </div>
    );
};

export default ImageSearch;