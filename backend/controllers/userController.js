const User = require('../models/User');

/**
 * @desc    Get all users (Admin only) with pagination
 * @route   GET /api/users
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get total count for pagination info
        const total = await User.countDocuments();

        // Get users with pagination
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                    hasMore: page * limit < total
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get user by ID (Admin only)
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Activate user account (Admin only)
 * @route   PATCH /api/users/:id/activate
 * @access  Private/Admin
 */
exports.activateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent self-modification
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot modify your own status'
            });
        }

        user.status = 'active';
        await user.save({ validateModifiedOnly: true });

        res.json({
            success: true,
            message: 'User activated successfully',
            data: { user: user.toJSON() }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Deactivate user account (Admin only)
 * @route   PATCH /api/users/:id/deactivate
 * @access  Private/Admin
 */
exports.deactivateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent self-modification
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot modify your own status'
            });
        }

        user.status = 'inactive';
        await user.save({ validateModifiedOnly: true });

        res.json({
            success: true,
            message: 'User deactivated successfully',
            data: { user: user.toJSON() }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            success: true,
            data: { user: user.toJSON() }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update current user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
    try {
        const { fullName, email } = req.body;
        const user = await User.findById(req.user._id);

        // Check if email is being changed and if new email exists
        if (email && email.toLowerCase() !== user.email) {
            const emailExists = await User.findOne({ email: email.toLowerCase() });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use'
                });
            }
            user.email = email.toLowerCase();
        }

        if (fullName) {
            user.fullName = fullName;
        }

        await user.save({ validateModifiedOnly: true });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: { user: user.toJSON() }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Change password
 * @route   PUT /api/users/password
 * @access  Private
 */
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id).select('+password');

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        next(error);
    }
};
