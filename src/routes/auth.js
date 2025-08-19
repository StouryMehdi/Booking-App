const express = require('express');
const router = express.Router();
const { loginUser } = require('../utils/auth');
const { validateUser } = require('../middlewares/validators');

router.post('/login', validateUser, async (req, res) => {
  try {
    console.log('Login attempt for:', req.body.email);
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    
    if (result.error) {
      console.log('Login failed:', result.error);
      return res.status(401).json({ error: result.error });
    }

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    console.log('Login successful for:', email);
    res.json({
      token: result.token,
      user: result.user
    });

  } catch (err) {
    console.error('Login error:', err.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;