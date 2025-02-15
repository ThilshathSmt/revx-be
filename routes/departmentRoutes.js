const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const departmentController = require('../controllers/departmentController');

const router = express.Router();

// Create a new department
router.post('/create', authenticate, departmentController.createDepartment);

// Get all departments
router.get('/', authenticate, departmentController.getDepartments);

module.exports = router;
