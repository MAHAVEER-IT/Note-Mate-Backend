const express = require('express');
const router = express.Router();
const { generateStudyPlan } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Protected route - requires JWT authentication
router.post('/chat/completions', protect, generateStudyPlan);

module.exports = router;
