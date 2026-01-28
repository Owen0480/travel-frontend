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
        const isAuthRequest = originalRequest.url.includes('/auth/login') ||
            originalRequest.url.includes('/auth/register') ||
            originalRequest.url.includes('/auth/refresh');

        if (!originalRequest || error.response?.status !== 401 || originalRequest._retry || isAuthRequest) {
            return Promise.reject(error);
        }
        originalRequest._retry = true;
        try {
            const response = await api.post('/auth/refresh');

            const { accessToken: newAccessToken, email: newEmail } = response.data;

            localStorage.setItem('accessToken', newAccessToken);
            if (newEmail) {
                localStorage.setItem('email', newEmail);
            }

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
        } catch (err) {
            console.error('Token refresh failed', err);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('email');
            window.location.href = '/login';
            return Promise.reject(err);
        }
    }
);

export default api;
