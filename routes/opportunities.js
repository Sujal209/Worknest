const express = require('express');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const auth = require('../middleware/auth');

const router = express.Router();
// Get all opportunities
router.get('/', async (req, res) => {
    try {
        const opportunities = await Opportunity.find();
        const applications = await Application.find();

        const oppsWithCount = opportunities.map(opp => {
            const count = applications.filter(app => app.opportunityId === (opp._id || opp.id)).length;
            return { ...opp, applicantCount: count };
        });

        res.json(oppsWithCount);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create a new opportunity
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'recruiter' && req.user.role !== 'ngo') {
            return res.status(403).json({ message: 'Not authorized to post jobs' });
        }

        const { title, organization, category, location, durationOrType, compensation, skillsRequired, expectedSalary } = req.body;

        const newOpData = {
            recruiter: req.user.id,
            title,
            organization,
            category,
            location,
            durationOrType,
            compensation,
            skillsRequired,
            expectedSalary
        };

        const savedOp = await Opportunity.save(newOpData);
        res.json(savedOp);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete an opportunity
router.delete('/:id', auth, async (req, res) => {
    try {
        console.log('Delete Request for ID:', req.params.id);
        console.log('Current User from Token:', req.user);

        const opportunity = await Opportunity.findById(req.params.id);
        if (!opportunity) {
            console.log('Opportunity not found in DB');
            return res.status(404).json({ message: 'Opportunity not found' });
        }

        console.log('Found Opportunity:', opportunity);
        console.log('Comparing Owner:', opportunity.recruiter, 'with User:', req.user.id);

        // Check if the user is the recruiter who posted it
        // Basic check with == to handle potential string/number mismatches, 
        // though both should be strings in this JsonDB implementation.
        if (opportunity.recruiter != req.user.id) {
            console.log('Unauthorized: Owner mismatch');
            return res.status(403).json({ message: 'Not authorized to delete this opportunity' });
        }

        const result = await Opportunity.findByIdAndDelete(req.params.id);
        console.log('Delete Result:', result);

        res.json({ message: 'Opportunity deleted successfully' });
    } catch (err) {
        console.error('Delete Route Error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
