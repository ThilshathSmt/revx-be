const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Update user details by ID (allowing users to update their own details)
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, employeeDetails, managerDetails, hrDetails } = req.body;

  try {
    const loggedInUser = req.user;
    // Check if the logged-in user is updating their own details
    if (loggedInUser._id.toString() !== id) {
      return res.status(403).json({ message: 'You can only update your own details' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields if provided
    if (username) user.username = username;
    if (email) user.email = email;

    if (password) {
      // Hash the new password if provided in plain text
      const salt = await bcrypt.genSalt(10);  // Generate a salt
      user.password = await bcrypt.hash(password, salt);  // Hash the password and save it
    }

    if (employeeDetails) user.employeeDetails = employeeDetails;
    if (managerDetails) user.managerDetails = managerDetails;
    if (hrDetails) user.hrDetails = hrDetails;

    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};