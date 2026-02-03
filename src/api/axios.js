import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Backend URL
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 디버깅을 위한 로그
        if (error.response) {
            console.log(`[API Error] Status: ${error.response.status} | URL: ${originalRequest?.url}`);
        }

        // Prevent infinite loops correctly
        if (!originalRequest || originalRequest._retry) {
            return Promise.reject(error);
        }

        // If 401 Unauthorized or 403 Forbidden happens
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('🔄 Token expired. Attempting refresh...');
            originalRequest._retry = true; // Mark this request as retried

            try {
                // Request token refresh (using Cookie)
                // Use raw axios to prevent interceptor interference
                const refreshResponse = await axios.post('http://localhost:8080/api/auth/refresh', {}, {
                    withCredentials: true
                });

                // Get new Access Token from response (Body)
                const { accessToken: newAccessToken } = refreshResponse.data;

                if (newAccessToken) {
                    console.log('✅ Token refresh successful. Retrying original request...');
                    // Update Local Storage
                    localStorage.setItem('accessToken', newAccessToken);

                    // Update the failed request's Authorization header with NEW token
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    // Retry the original request
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // If refresh fails (Refresh Token expired or invalid), force logout
                console.error('❌ Refresh failed. Logging out.', refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('email');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
