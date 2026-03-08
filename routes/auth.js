const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register Action
router.post('/register', async (req, res) => {
    try {
        const { name, email, role, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = {
            name,
            email,
            role,
            password: hashedPassword
        };

        const savedUser = await User.save(user);

        // Create JWT payload
        const payload = { user: { id: savedUser.id, role: savedUser.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: savedUser.id, name: savedUser.name, email: savedUser.email, role: savedUser.role } });
    } catch (err) {
        console.error('Registration Error:', err.message, err.stack);
        res.status(500).json({ message: 'Server Error: ' + err.message, stack: err.stack });
    }
});

// Login Action
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Create JWT payload
        const payload = { user: { id: user.id, role: user.role, name: user.name } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, cv: user.cv } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update CV (Protected)
const auth = require('../middleware/auth');
router.put('/cv', auth, async (req, res) => {
    try {
        const { bio, skills, experience } = req.body;

        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cv = { bio, skills, experience };
        await User.save(user);

        res.json({ message: 'CV updated successfully', cv: user.cv });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get My Info (Protected - good for reloading CV)
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) delete user.password;
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
