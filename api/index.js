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

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Routes with error handling
try {
    app.use('/api/auth', require('../routes/auth'));
    app.use('/api/opportunities', require('../routes/opportunities'));
    app.use('/api/applications', require('../routes/applications'));
    app.use('/api/messages', require('../routes/messages'));
} catch (err) {
    console.error('Error loading routes:', err);
}

// Serve index.html for SPA routing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Fallback for SPA routing - any route not matching API
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

module.exports = app;
