import api from './api';

export const userService = {
    /**
     * Get all users with pagination (Admin only)
     */
    getAllUsers: async (page = 1, limit = 10) => {
        const response = await api.get(`/users?page=${page}&limit=${limit}`);
        return response.data;
    },

    /**
     * Get user by ID (Admin only)
     */
    getUserById: async (userId) => {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    },

    /**
     * Activate user account (Admin only)
     */
    activateUser: async (userId) => {
        const response = await api.patch(`/users/${userId}/activate`);
        return response.data;
    },

    /**
     * Deactivate user account (Admin only)
     */
    deactivateUser: async (userId) => {
        const response = await api.patch(`/users/${userId}/deactivate`);
        return response.data;
    },

    /**
     * Get current user profile
     */
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    /**
     * Update current user profile
     */
    updateProfile: async (profileData) => {
        const response = await api.put('/users/profile', profileData);
        // Update stored user
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    /**
     * Change password
     */
    changePassword: async (passwordData) => {
        const response = await api.put('/users/password', passwordData);
        return response.data;
    }
};

export default userService;
