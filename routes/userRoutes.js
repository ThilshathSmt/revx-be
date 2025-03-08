const express = require('express');
const router = express.Router();
const { updateUser } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
// Route to update a user by ID (Allowing users to update their own details)
router.put('/update/:id',updateUser);
module.exports = router;