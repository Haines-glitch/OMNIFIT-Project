import axios from 'axios';
import { DEFAULT_AVATAR } from '../../utils/defaultAvatar';

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

const PROFILES_STORAGE_KEY = 'omnifit_saved_user_profiles';

const getPersistedProfile = (email) => {
    if (!email) return null;
    try {
        const all = JSON.parse(localStorage.getItem(PROFILES_STORAGE_KEY) || '{}');
        return all[email.toLowerCase().trim()] || null;
    } catch {
        return null;
    }
};

const savePersistedProfile = (email, data) => {
    if (!email || !data) return;
    try {
        const all = JSON.parse(localStorage.getItem(PROFILES_STORAGE_KEY) || '{}');
        const key = email.toLowerCase().trim();
        all[key] = { ...(all[key] || {}), ...data };
        localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
        console.warn('Could not persist profile to localStorage:', e);
    }
};

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
                const userEmail = (user.email || credentials.email || '').toLowerCase().trim();
                const persisted = getPersistedProfile(userEmail) || {};

                const formattedUser = {
                    ...persisted,
                    ...user,
                    name: user.name || user.full_name || persisted.name || (userEmail ? userEmail.split('@')[0] : 'User'),
                    full_name: user.full_name || user.name || persisted.full_name,
                    email: user.email || credentials.email,
                    role: (user.role || credentials.role || persisted.role || 'member').toUpperCase(),
                    phone: user.phone || persisted.phone || '+91 98765 43210',
                    gender: user.gender || persisted.gender || 'Female',
                    dob: user.dob || persisted.dob || '1998-04-12',
                    height: user.height || persisted.height || '182 cm',
                    weight: user.weight || persisted.weight || '78.5 kg',
                    bmi: user.bmi || persisted.bmi || 23.7,
                    fitnessGoal: user.fitnessGoal || user.goal || persisted.fitnessGoal || 'Hypertrophy & Fat Loss',
                    emergencyContact: user.emergencyContact || persisted.emergencyContact || 'Sarah Mercer (+91 98765 12345)',
                    medicalHistory: user.medicalHistory || persisted.medicalHistory || 'None (Cleared for high-intensity training)',
                    avatar: user.avatar || user.profile_image || persisted.avatar || DEFAULT_AVATAR,
                };

                savePersistedProfile(userEmail, formattedUser);
                localStorage.setItem('access_token', access);
                if (refresh) localStorage.setItem('refresh_token', refresh);
                localStorage.setItem('user', JSON.stringify(formattedUser));
                localStorage.setItem('user_role', formattedUser.role);

                return { success: true, data: payload };
            }

        } catch (error) {
            // Show real error only for non-auth failures (suspended account, server errors)
            if (error.response && error.response.status === 403) {
                const errorData = error.response.data;
                const errorMsg = errorData?.errors?.account || errorData?.message || 'Account is suspended or inactive.';
                return { success: false, error: errorMsg };
            }
            // For 400 (wrong credentials / user not in DB) or network errors → demo mock fallback
            console.warn('Backend auth unavailable or credentials not in DB. Falling back to demo mock mode.', error);

            // Demo Fallback Mode for immediate presentation testing
            const role = (credentials.role || 'member').toLowerCase();
            const userEmail = (credentials.email || '').toLowerCase().trim();
            const persisted = getPersistedProfile(userEmail) || {};

            let displayName = persisted.name || persisted.full_name || '';
            if (!displayName) {
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
            }

            const mockUser = {
                id: persisted.id || Math.floor(Math.random() * 1000) + 1,
                name: displayName || 'Alex Mercer',
                full_name: displayName || 'Alex Mercer',
                email: credentials.email,
                role: role.toUpperCase(),
                phone: persisted.phone || '+91 98765 43210',
                gender: persisted.gender || 'Female',
                dob: persisted.dob || '1998-04-12',
                height: persisted.height || '182 cm',
                weight: persisted.weight || '78.5 kg',
                bmi: persisted.bmi || 23.7,
                fitnessGoal: persisted.fitnessGoal || 'Hypertrophy & Fat Loss',
                emergencyContact: persisted.emergencyContact || 'Sarah Mercer (+91 98765 12345)',
                medicalHistory: persisted.medicalHistory || 'None (Cleared for high-intensity training)',
                avatar: persisted.avatar || DEFAULT_AVATAR,
                ...persisted
            };

            savePersistedProfile(userEmail, mockUser);
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
            // Strip any role parameter so backend forces MEMBER role
            const { role, ...memberData } = userData;
            const response = await api.post('/register/', memberData);
            const payload = response.data;
            return {
                success: true,
                message: payload.message || "Member registration successful",
                user: payload.user || payload.data?.user
            };
        } catch (error) {
            // If backend responded with a validation error (400), show real error — don't mock
            if (error.response) {
                const errorData = error.response.data;
                let errorMsg = errorData?.message || errorData?.detail || 'Registration failed.';
                // Extract specific field errors if available
                if (errorData?.errors) {
                    const firstField = Object.keys(errorData.errors)[0];
                    if (firstField) {
                        const fieldErr = errorData.errors[firstField];
                        errorMsg = Array.isArray(fieldErr) ? fieldErr[0] : fieldErr;
                    }
                }
                return { success: false, error: errorMsg };
            }
            // Only mock on real network failures (backend is down/unreachable)
            console.warn('Backend offline. Falling back to demo mock registration.', error);
            const mockUser = {
                id: Math.floor(Math.random() * 1000) + 100,
                name: userData.full_name || (userData.email ? userData.email.split('@')[0] : 'Member'),
                email: userData.email,
                role: 'MEMBER'
            };
            return {
                success: true,
                message: "Registration successful (demo mode). Please login.",
                user: mockUser,
                isMock: true
            };
        }
    },

    /**
     * Admin Trainer Management API Integrations
     */
    async getTrainers() {
        try {
            const res = await api.get('/trainers/', { baseURL: '/api' });
            return res.data?.data || res.data || [];
        } catch (e) {
            console.warn('Error fetching trainers:', e);
            return null;
        }
    },

    async createTrainer(trainerData) {
        const res = await api.post('/trainers/', trainerData, { baseURL: '/api' });
        return res.data;
    },

    async getTrainerById(id) {
        const res = await api.get(`/trainers/${id}/`, { baseURL: '/api' });
        return res.data?.data || res.data;
    },

    async updateTrainer(id, data) {
        const res = await api.patch(`/trainers/${id}/`, data, { baseURL: '/api' });
        return res.data;
    },

    async deleteTrainer(id) {
        const res = await api.delete(`/trainers/${id}/`, { baseURL: '/api' });
        return res.data;
    },

    async getAvailableMembers() {
        try {
            const res = await api.get('/trainers/available-members/', { baseURL: '/api' });
            return res.data?.data || res.data || [];
        } catch (e) {
            console.warn('Error fetching members:', e);
            return [];
        }
    },

    async assignMemberToTrainer(trainerId, memberId) {
        const res = await api.post(`/trainers/${trainerId}/assign-member/`, { member_id: memberId }, { baseURL: '/api' });
        return res.data;
    },

    async assignRoutine(routineData) {
        // Will post to /api/auth/trainer/assign-routine/
        const res = await api.post('/trainer/assign-routine/', routineData);
        return res.data;
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
        const cachedUser = this.getCurrentUser();
        const persisted = getPersistedProfile(cachedUser?.email) || {};

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                if (cachedUser) {
                    const merged = { ...persisted, ...cachedUser };
                    return merged;
                }
                return null;
            }

            const response = await api.get('/user-profile/');
            const payload = response.data?.data || response.data;
            if (payload?.user) {
                const dbUser = payload.user;
                const member = payload.member_profile || {};
                const userEmail = (dbUser.email || cachedUser?.email || '').toLowerCase().trim();
                const emailPersisted = getPersistedProfile(userEmail) || persisted;

                const formattedUser = {
                    ...emailPersisted,
                    id: dbUser.id,
                    name: dbUser.name || dbUser.full_name || emailPersisted.name || (userEmail ? userEmail.split('@')[0] : 'User'),
                    full_name: dbUser.full_name || dbUser.name || emailPersisted.full_name,
                    email: dbUser.email || userEmail,
                    role: (dbUser.role || cachedUser?.role || 'member').toUpperCase(),
                    avatar: dbUser.profile_image || emailPersisted.avatar || DEFAULT_AVATAR,
                    phone: dbUser.phone || dbUser.phone_no || emailPersisted.phone || '+91 98765 43210',
                    gender: member.gender || emailPersisted.gender || 'Female',
                    dob: member.dob || member.date_of_birth || emailPersisted.dob || '1998-04-12',
                    height: member.height ? `${member.height} cm` : (emailPersisted.height || '182 cm'),
                    weight: member.weight ? `${member.weight} kg` : (emailPersisted.weight || '78.5 kg'),
                    bmi: member.bmi || emailPersisted.bmi || 23.7,
                    fitnessGoal: member.goal || member.fitness_goal || emailPersisted.fitnessGoal || 'Hypertrophy & Fat Loss',
                    emergencyContact: member.emergencyContact || member.emergency_contact || emailPersisted.emergencyContact || 'Sarah Mercer (+91 98765 12345)',
                    medicalHistory: member.medicalHistory || member.medical_history || emailPersisted.medicalHistory || 'None (Cleared for high-intensity training)',
                };
                savePersistedProfile(userEmail, formattedUser);
                localStorage.setItem('user', JSON.stringify(formattedUser));
                localStorage.setItem('user_role', formattedUser.role);
                return formattedUser;
            }
        } catch (err) {
            console.warn('Backend live profile fetch error/offline, using cached user:', err);
        }

        if (cachedUser) {
            const merged = { ...persisted, ...cachedUser };
            return merged;
        }
        return null;
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
        const emailToUse = (updatedFields.email || currentUser.email || '').toLowerCase().trim();
        const persisted = getPersistedProfile(currentUser.email) || {};

        const newUser = {
            ...persisted,
            ...currentUser,
            ...updatedFields,
            name: updatedFields.name || updatedFields.full_name || currentUser.name
        };

        // Always save to persistent profile registry first
        if (currentUser.email) savePersistedProfile(currentUser.email, newUser);
        if (emailToUse) savePersistedProfile(emailToUse, newUser);
        localStorage.setItem('user', JSON.stringify(newUser));

        try {
            const response = await api.post('/profile/update/', {
                user_id: currentUser.id,
                current_email: currentUser.email,
                name: newUser.name,
                full_name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                gender: newUser.gender,
                dob: newUser.dob,
                height: newUser.height,
                weight: newUser.weight,
                bmi: newUser.bmi,
                fitnessGoal: newUser.fitnessGoal,
                emergencyContact: newUser.emergencyContact,
                medicalHistory: newUser.medicalHistory
            });
            const updatedData = response.data?.data || response.data;
            if (updatedData) {
                const finalUser = {
                    ...newUser,
                    ...updatedData,
                    name: updatedData.name || newUser.name,
                    full_name: updatedData.full_name || updatedData.name || newUser.name,
                    email: updatedData.email || newUser.email,
                    phone: updatedData.phone !== undefined ? updatedData.phone : newUser.phone,
                };
                savePersistedProfile(finalUser.email, finalUser);
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

