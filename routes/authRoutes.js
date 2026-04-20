const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name', 'Name is required').notEmpty().trim(),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('role').optional().isIn(['staff', 'employee']).withMessage('Role must be staff or employee'),
  ],
  registerUser
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password is required').notEmpty(),
  ],
  loginUser
);

// GET /api/auth/me
router.get('/me', protect, getMe);

module.exports = router;
