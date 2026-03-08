const express = require('express');
const Application = require('../models/Application');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply for an opportunity
router.post('/', auth, async (req, res) => {
    try {
        const { opportunityId } = req.body;

        // Check if user already applied
        const existing = await Application.findOne({ user: req.user.id, opportunity: opportunityId });
        if (existing) {
            return res.status(400).json({ message: 'You have already applied to this opportunity' });
        }

        const applicationData = {
            user: req.user.id,
            opportunity: opportunityId,
            status: 'applied',
            appliedAt: new Date().toISOString()
        };

        const savedApp = await Application.save(applicationData);
        res.json(savedApp);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get user's applications
router.get('/my-applications', auth, async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user.id });
        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get ALL applications (For recruiters to view candidates)
router.get('/all', auth, async (req, res) => {
    try {
        if (req.user.role !== 'recruiter' && req.user.role !== 'ngo') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const applications = await Application.find();
        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update Application Status (Accept/Reject)
router.put('/:id/status', auth, async (req, res) => {
    try {
        if (req.user.role !== 'recruiter' && req.user.role !== 'ngo') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { status } = req.body;

        let application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        application.status = status;
        await Application.save(application);

        res.json(application);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ message: 'Application not found' });
        res.status(500).send('Server Error');
    }
});

module.exports = router;
