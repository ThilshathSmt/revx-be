const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const goalController = require('../controllers/goalController');

// HR creates a new goal
router.post('/create', authenticate, goalController.createGoal);

// Get all goals (for admin or HR)
router.get('/all', authenticate, goalController.getAllGoals);

// Get all goals assigned to a manager
router.get('/', authenticate, goalController.getGoalsForManager);

// Get a specific goal by ID
router.get('/:id', authenticate, goalController.getGoalById);

// Update a goal (HR or Manager)
router.put('/:id', authenticate, goalController.updateGoal);

// Delete a goal (HR)
router.delete('/:id', authenticate, goalController.deleteGoal);

module.exports = router;
