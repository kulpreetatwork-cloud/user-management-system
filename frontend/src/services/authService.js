import api from './api';

export const authService = {
    /**
     * Register a new user
     */
    signup: async (userData) => {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    },

    /**
     * Login user
     */
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.success) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    /**
     * Logout user
     */
    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            // Continue with logout even if API call fails
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    /**
     * Get current user
     */
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    /**
     * Get stored user from localStorage
     */
    getStoredUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    /**
     * Check if user is admin
     */
    isAdmin: () => {
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            return userData.role === 'admin';
        }
        return false;
    }
};

export default authService;
