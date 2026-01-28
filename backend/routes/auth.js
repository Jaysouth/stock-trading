const express = require('express');
const {
  register,
  login,
  getMe,
  enable2FA,
  verify2FA,
  verify2FALogin
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/2fa/login', verify2FALogin);
router.get('/me', protect, getMe);
router.post('/2fa/enable', protect, enable2FA);
router.post('/2fa/verify', protect, verify2FA);

module.exports = router;
