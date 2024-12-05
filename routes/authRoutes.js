const express = require('express');
const {
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/authController');

const router = express.Router();

// POST route for user registration (Create)
router.post('/register', registerUser);

// GET route for all users (Read)
router.get('/', getAllUsers);

// GET route for a single user by ID (Read)
router.get('/:id', getUserById);

// Update a user by ID (PUT and PATCH)
router.put('/:id', updateUser);  // For full update
router.patch('/:id', updateUser);  // For partial update


// DELETE route for deleting a user by ID (Delete)
router.delete('/:id', deleteUser);

module.exports = router;
