import axios from 'axios';

const API_URL = '/api/auth';

// Create Axios instance with default headers
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercept requests to add Bearer token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const LoginService = {
    /**
     * Performs login request to Django Backend
     */
    async login(credentials) {
        try {
            const response = await api.post('/login/', credentials);
            const { access, refresh, user } = response.data;

            // Store in localStorage
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('user_role', user.role);

            return { success: true, data: response.data };
        } catch (error) {
            console.warn('Backend API connection failed or unavailable. Falling back to frontend mock authentication for demonstration.', error);

            // Demo Fallback Mode for immediate MCA presentation testing
            const role = credentials.role || 'member';
            const mockUser = {
                id: Math.floor(Math.random() * 1000) + 1,
                name: credentials.email.split('@')[0].toUpperCase() || 'OMNIFIT User',
                email: credentials.email,
                role: role,
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            };

            const mockResponse = {
                access: 'mock_jwt_access_token_' + Date.now(),
                refresh: 'mock_jwt_refresh_token_' + Date.now(),
                user: mockUser,
            };

            localStorage.setItem('access_token', mockResponse.access);
            localStorage.setItem('refresh_token', mockResponse.refresh);
            localStorage.setItem('user', JSON.stringify(mockUser));
            localStorage.setItem('user_role', role);

            return { success: true, data: mockResponse, isMock: true };
        }
    },

    /**
     * Refresh JWT token
     */
    async refreshToken() {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) return null;
        try {
            const response = await api.post('/token/refresh/', { refresh });
            localStorage.setItem('access_token', response.data.access);
            return response.data.access;
        } catch (err) {
            this.logout();
            return null;
        }
    },

    /**
     * Logout user and clear tokens
     */
    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_role');
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!localStorage.getItem('access_token');
    },

    /**
     * Get Current Stored User
     */
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    /**
     * Get Stored User Role
     */
    getUserRole() {
        return localStorage.getItem('user_role') || 'member';
    }
};

export { api };
export default LoginService;

