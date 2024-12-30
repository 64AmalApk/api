// properties.js
const express = require('express');
const db = require('./db');
const router = express.Router();

// Get all properties
router.get('/properties', (req, res) => {
  const query = 'SELECT * FROM properties';
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching properties', error: err });
    }
    res.json(result);
  });
});

// Add a new property
router.post('/properties', (req, res) => {
  const { title, description, lat, lng, image, price, bedroom, bathroom, garage, city, state, country } = req.body;

  const query = 'INSERT INTO properties (title, description, lat, lng, image, price, bedroom, bathroom, garage, city, state, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [title, description, lat, lng, image, price, bedroom, bathroom, garage, city, state, country], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding property', error: err });
    }
    res.status(201).json({ message: 'Property added successfully' });
  });
});

module.exports = router;
