const express = require('express');
const router = express.Router();
const { readUsers } = require('../utils/db');

// Admin routes
router.get('/users', async (req, res, next) => {
  try {
    const users = await readUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;