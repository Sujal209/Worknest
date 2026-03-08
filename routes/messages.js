const express = require('express');
const MessageTemplate = require('../models/MessageTemplate');
const Message = require('../models/Message'); // Load new Message model
const auth = require('../middleware/auth');

const router = express.Router();

// Create a message template
router.post('/templates', auth, async (req, res) => {
    try {
        // Only allow recruiters to create templates
        if (req.user.role !== 'recruiter' && req.user.role !== 'ngo') {
            return res.status(403).json({ message: 'Not authorized to create templates' });
        }

        const { title, content } = req.body;

        const templateData = {
            recruiter: req.user.id,
            title,
            content
        };

        const savedTemplate = await MessageTemplate.save(templateData);
        res.json(savedTemplate);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get recruiter's templates
router.get('/templates', auth, async (req, res) => {
    try {
        const templates = await MessageTemplate.find({ recruiter: req.user.id });
        res.json(templates);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Send a direct message to a student (using a template ideally, or custom text)
router.post('/send', auth, async (req, res) => {
    try {
        if (req.user.role !== 'recruiter' && req.user.role !== 'ngo') {
            return res.status(403).json({ message: 'Not authorized to send messages' });
        }

        const { studentId, opportunityId, title, content } = req.body;

        const msgData = {
            recruiter: req.user.id,
            student: studentId,
            opportunity: opportunityId,
            title,
            content
        };

        const savedMsg = await Message.save(msgData);
        res.json(savedMsg);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all messages sent to the logged in student
router.get('/my-messages', auth, async (req, res) => {
    try {
        const messages = await Message.find({ student: req.user.id });
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
