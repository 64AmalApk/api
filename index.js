// server.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./auth');
const propertyRoutes = require('./properties');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', propertyRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
