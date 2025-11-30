const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ApiError } = require('../shared/utils/errorHandler');
const { STATUS_CODES, JWT_EXPIRES_IN } = require('../shared/constants');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
};

// Register new user
exports.register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(STATUS_CODES.BAD_REQUEST, 'User already exists with this email');
        }

        // Create new user
        const user = await User.create({ email, password, name });

        // Generate token
        const token = generateToken(user._id);

        res.status(STATUS_CODES.CREATED).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                },
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// Login user
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Please provide email and password');
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Invalid credentials');
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Invalid credentials');
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                },
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get current user profile
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found');
        }

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Change password
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Current and new password required');
        }

        const user = await User.findById(req.user.id);
        const isValid = await user.comparePassword(currentPassword);

        if (!isValid) {
            throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Current password is incorrect');
        }

        user.password = newPassword;
        await user.save();

        res.status(STATUS_CODES.OK).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        next(error);
    }
};
