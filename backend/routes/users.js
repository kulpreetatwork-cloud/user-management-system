const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    activateUser,
    deactivateUser,
    getProfile,
    updateProfile,
    changePassword
} = require('../controllers/userController');
const { updateProfileValidation, changePasswordValidation } = require('../validators/authValidator');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// User profile routes (must come before /:id routes)
/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', auth, getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile', auth, updateProfileValidation, updateProfile);

/**
 * @route   PUT /api/users/password
 * @desc    Change password
 * @access  Private
 */
router.put('/password', auth, changePasswordValidation, changePassword);

// Admin-only routes
/**
 * @route   GET /api/users
 * @desc    Get all users with pagination
 * @access  Private/Admin
 */
router.get('/', auth, roleCheck('admin'), getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private/Admin
 */
router.get('/:id', auth, roleCheck('admin'), getUserById);

/**
 * @route   PATCH /api/users/:id/activate
 * @desc    Activate user account
 * @access  Private/Admin
 */
router.patch('/:id/activate', auth, roleCheck('admin'), activateUser);

/**
 * @route   PATCH /api/users/:id/deactivate
 * @desc    Deactivate user account
 * @access  Private/Admin
 */
router.patch('/:id/deactivate', auth, roleCheck('admin'), deactivateUser);

module.exports = router;
