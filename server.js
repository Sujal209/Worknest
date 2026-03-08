require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/opportunities', require('./routes/opportunities'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/messages', require('./routes/messages'));

// Default Route
app.get('/', (req, res) => {
    res.send('WorkNest API is running (JSON DB Mode)...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
