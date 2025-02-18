const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const goalReviewController = require('../controllers/goalReviewController');

// HR creates a new review cycle for a goal
router.post('/create', authenticate, goalReviewController.createReviewCycle);

// Get all review cycles assigned to the logged-in manager
router.get('/', authenticate, goalReviewController.getManagerReviews);

// Get a specific review cycle by ID
router.get('/:id', authenticate, goalReviewController.getReviewCycleById);

// Manager provides a review for a review cycle
router.put('/:id/review', authenticate, goalReviewController.provideReview);

// Update a review cycle (HR/Admin functionality)
router.put('/:id', authenticate, goalReviewController.updateReviewCycle);

// Delete a review cycle (HR Admin only)
router.delete('/:id', authenticate, goalReviewController.deleteReviewCycle);

module.exports = router;