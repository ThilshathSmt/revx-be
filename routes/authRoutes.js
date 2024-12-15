const express = require('express');
const { register, login, resetPassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Register Route - Only HR can create new users (Employee, Manager, or other HRs)
router.post('/register', authenticate, register);

// Login Route - Any user (Employee, Manager, HR) can log in
router.post('/login', login);

// Reset Password Route - Any user (Employee, Manager, HR) can reset their password
router.post('/reset-password', resetPassword);

module.exports = router;

