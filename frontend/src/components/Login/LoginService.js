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
            const payload = response.data?.data || response.data;
            const { access, refresh, user } = payload;

            if (user && access) {
                const formattedUser = {
                    ...user,
                    name: user.name || user.full_name || (user.email ? user.email.split('@')[0] : 'User'),
                    full_name: user.full_name || user.name,
                    role: (user.role || credentials.role || 'member').toUpperCase()
                };
                localStorage.setItem('access_token', access);
                if (refresh) localStorage.setItem('refresh_token', refresh);
                localStorage.setItem('user', JSON.stringify(formattedUser));
                localStorage.setItem('user_role', formattedUser.role);

                return { success: true, data: payload };
            }

            return { success: false, error: 'Invalid login response structure' };
        } catch (error) {
            console.warn('Backend API connection failed or unavailable. Falling back to frontend mock authentication for demonstration.', error);

            // Demo Fallback Mode for immediate MCA presentation testing
            const role = (credentials.role || 'member').toLowerCase();
            let displayName = '';

            const currentUser = this.getCurrentUser();
            if (currentUser && currentUser.email?.toLowerCase() === credentials.email?.toLowerCase() && (currentUser.name || currentUser.full_name)) {
                displayName = currentUser.name || currentUser.full_name;
            } else if (credentials.email === 'member@omnifit.com') {
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
            const payload = response.data?.data || response.data;
            const newAccess = payload.access || response.data.access;
            if (newAccess) {
                localStorage.setItem('access_token', newAccess);
            }
            return newAccess;
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
            const payload = response.data?.data || response.data;
            const { access, refresh, user } = payload;

            if (access && user) {
                const formattedUser = {
                    ...user,
                    name: user.name || user.full_name || userData.full_name || 'User',
                    full_name: user.full_name || user.name || userData.full_name,
                    role: (user.role || userData.role || 'member').toUpperCase()
                };
                localStorage.setItem('access_token', access);
                if (refresh) localStorage.setItem('refresh_token', refresh);
                localStorage.setItem('user', JSON.stringify(formattedUser));
                localStorage.setItem('user_role', formattedUser.role);
            }

            return { success: true, data: payload };
        } catch (error) {
            console.warn('Backend API connection failed or unavailable. Falling back to frontend mock registration for demonstration.', error);

            const mockUser = {
                id: Math.floor(Math.random() * 1000) + 100,
                name: userData.full_name || userData.email.split('@')[0].toUpperCase(),
                email: userData.email,
                phone: userData.phone || '',
                role: (userData.role || 'member').toUpperCase(),
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
     * Fetch Live User Profile from Backend DB
     */
    async fetchCurrentUser() {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return this.getCurrentUser();

            const response = await api.get('/profile/');
            const payload = response.data?.data || response.data;
            if (payload?.user) {
                const dbUser = payload.user;
                const formattedUser = {
                    id: dbUser.id,
                    name: dbUser.name || dbUser.full_name || (dbUser.email ? dbUser.email.split('@')[0] : 'User'),
                    full_name: dbUser.full_name || dbUser.name,
                    email: dbUser.email,
                    role: (dbUser.role || 'member').toUpperCase(),
                    avatar: dbUser.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                    phone: dbUser.phone || dbUser.phone_no || '',
                };
                localStorage.setItem('user', JSON.stringify(formattedUser));
                localStorage.setItem('user_role', formattedUser.role);
                return formattedUser;
            }
        } catch (err) {
            console.warn('Backend live profile fetch error/offline, using cached user:', err);
        }
        return this.getCurrentUser();
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
        const newUser = {
            ...currentUser,
            ...updatedFields,
            name: updatedFields.name || updatedFields.full_name || currentUser.name
        };
        localStorage.setItem('user', JSON.stringify(newUser));

        try {
            const response = await api.post('/profile/update/', {
                user_id: currentUser.id,
                name: newUser.name,
                full_name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                height: newUser.height,
                weight: newUser.weight,
                fitnessGoal: newUser.fitnessGoal
            });
            const updatedData = response.data?.data || response.data;
            if (updatedData) {
                const finalUser = {
                    ...newUser,
                    name: updatedData.name || newUser.name,
                    full_name: updatedData.name || newUser.name,
                    email: updatedData.email || newUser.email,
                    phone: updatedData.phone || newUser.phone,
                };
                localStorage.setItem('user', JSON.stringify(finalUser));
                return finalUser;
            }
        } catch (e) {
            console.log('Backend profile sync note:', e);
        }

        return newUser;
    }
};

export { api };
export default LoginService;

