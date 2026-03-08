require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, '..')));

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/opportunities', require('../routes/opportunities'));
app.use('/api/applications', require('../routes/applications'));
app.use('/api/messages', require('../routes/messages'));

// Serve index.html for SPA routing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Fallback for SPA routing - any route not matching API
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

module.exports = app;
