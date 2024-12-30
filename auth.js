// auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  const { username, firstname, lastname, email, password, mobile, city, state, country, latitude, longitude } = req.body;

  if (!username || !firstname || !lastname || !email || !password || !mobile || !city || !state || !country) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (username, firstname, lastname, email, password, mobile, city, state, country, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [username, firstname, lastname, email, hashedPassword, mobile, city, state, country, latitude, longitude], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error registering user', error: err });
    }
    res.status(201).json({ message: 'User registered successfully' });
  });
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, result) => {
    if (err || result.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

module.exports = router;
