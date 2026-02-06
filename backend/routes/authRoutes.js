const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register); // Ideally protect this for Admin only: protect, authorize('admin'), register
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
