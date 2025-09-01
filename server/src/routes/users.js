const express = require('express');
const UserController = require('../controllers/UserController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// User registration endpoint (no auth required)
router.post('/register', UserController.register);

// Get user profile (auth required)
router.get('/profile', requireAuth, UserController.getProfile);

module.exports = router;