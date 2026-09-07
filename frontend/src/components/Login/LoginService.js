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
            const role = (credentials.role || 'member').toLowerCase();
            let displayName = '';

            if (credentials.email === 'member@omnifit.com') {
                displayName = 'Alex Mercer';
            } else if (credentials.email === 'trainer@omnifit.com') {
                displayName = 'Marcus Vance';
            } else if (credentials.email === 'admin@omnifit.com') {
                displayName = 'Sarah Jenkins';
            } else if (credentials.email) {
                const raw = credentials.email.includes('@') ? credentials.email.split('@')[0] : credentials.email;
                const parts = raw.replace(/[\._-]/g, ' ').trim().split(/\s+/);
                displayName = parts.map(p => p.length <= 2 ? p.toUpperCase() : (p.charAt(0).toUpperCase() + p.slice(1))).join(' ');
            } else {
                displayName = role === 'trainer' ? 'Marcus Vance' : (role === 'admin' ? 'Sarah Jenkins' : 'Alex Mercer');
            }

            const mockUser = {
                id: Math.floor(Math.random() * 1000) + 1,
                name: displayName || 'Alex Mercer',
                email: credentials.email,
                role: role.toUpperCase(),
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
            localStorage.setItem('user_role', role.toUpperCase());

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
     * Performs registration request to Django Backend
     */
    async register(userData) {
        try {
            const response = await api.post('/register/', userData);
            const { access, refresh, user } = response.data;

            if (access) {
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('user_role', user.role || userData.role || 'member');
            }

            return { success: true, data: response.data };
        } catch (error) {
            console.warn('Backend API connection failed or unavailable. Falling back to frontend mock registration for demonstration.', error);

            const mockUser = {
                id: Math.floor(Math.random() * 1000) + 100,
                name: userData.full_name || userData.email.split('@')[0].toUpperCase(),
                email: userData.email,
                phone: userData.phone || '',
                role: userData.role || 'member',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            };

            const mockResponse = {
                access: 'mock_jwt_access_token_' + Date.now(),
                refresh: 'mock_jwt_refresh_token_' + Date.now(),
                user: mockUser,
                message: 'User registered successfully.'
            };

            localStorage.setItem('access_token', mockResponse.access);
            localStorage.setItem('refresh_token', mockResponse.refresh);
            localStorage.setItem('user', JSON.stringify(mockUser));
            localStorage.setItem('user_role', mockUser.role);

            return { success: true, data: mockResponse, isMock: true };
        }
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
    },

    /**
     * Update Current Stored User in localStorage & Backend DB
     */
    async updateCurrentUser(updatedFields) {
        const currentUser = this.getCurrentUser() || {};
        const newUser = { ...currentUser, ...updatedFields };
        localStorage.setItem('user', JSON.stringify(newUser));

        try {
            const token = localStorage.getItem('access_token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            await fetch('http://localhost:8000/api/auth/profile/update/', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    user_id: currentUser.id,
                    ...newUser
                })
            });
        } catch (e) {
            console.log('Backend profile sync note:', e);
        }

        return newUser;
    }
};

export { api };
export default LoginService;

