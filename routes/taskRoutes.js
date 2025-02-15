const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const {
  createTask,
  getTasksForEmployee,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

const router = express.Router();

// Create a new task (Manager assigns task)
router.post('/create', authenticate, createTask);

// Get all tasks (Admin/Manager)
router.get('/all', authenticate, getAllTasks);

// Get tasks assigned to the logged-in employee
router.get('/', authenticate, getTasksForEmployee);

// Get a single task by ID
router.get('/:id', authenticate, getTaskById);

// Update a task
router.put('/:id', authenticate, updateTask);

// Delete a task
router.delete('/:id', authenticate, deleteTask);

module.exports = router;
