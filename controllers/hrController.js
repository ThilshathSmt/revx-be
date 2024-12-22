const User = require('../models/User');
const bcrypt = require('bcryptjs');
// Create a new user (Employee, Manager, or HR)
exports.createUser = async (req, res) => {
  const { username, email, password, role, employeeDetails, managerDetails, hrDetails } = req.body;

  try {
    // Only HR can create users
    const loggedInUser = req.user;
    if (loggedInUser.role !== 'hr') {
      return res.status(403).json({ message: 'Only HR can create new users' });
    }

    // Validate role
    if (!['employee', 'manager', 'hr'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Role-specific validations
    if (role === 'employee' && !employeeDetails) {
      return res.status(400).json({ message: 'Employee details are required for the employee role' });
    }
    if (role === 'manager' && !managerDetails) {
      return res.status(400).json({ message: 'Manager details are required for the manager role' });
    }
    if (role === 'hr' && !hrDetails) {
      return res.status(400).json({ message: 'HR details are required for the HR role' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // Hash with salt rounds

    // Initialize user data
    const userData = {
      username,
      email,
      password: hashedPassword, // Store the hashed password
      role,
    };

    // Handle role-specific details
    if (role === 'employee') {
      userData.employeeDetails = employeeDetails;
    } else if (role === 'manager') {
      if (!managerDetails.team || !Array.isArray(managerDetails.team)) {
        return res.status(400).json({ message: 'Manager team must be a list of employee usernames' });
      }

      // Find employees by their usernames
      const employees = await User.find({ username: { $in: managerDetails.team }, role: 'employee' });

      if (employees.length !== managerDetails.team.length) {
        return res.status(400).json({ message: 'One or more employees not found for the manager team' });
      }

      // Assign employee ObjectIDs to managerDetails.team
      userData.managerDetails = {
        department: managerDetails.department,
        team: employees.map(emp => emp._id),
      };
    } else if (role === 'hr') {
      userData.hrDetails = hrDetails;
    }

    // Create and save the new user
    const newUser = new User(userData);
    await newUser.save();

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
      userId: newUser._id,
    });
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Fetch all users (HR functionality)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch user details by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role, employeeDetails, managerDetails, hrDetails } = req.body;

  try {
    // Only HR can update users
    const loggedInUser = req.user;
    if (loggedInUser.role !== 'hr') {
      return res.status(403).json({ message: 'Only HR can update users' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (username) user.username = username;
    if (email) user.email = email;

    if (password) {
      // Hash the new password if provided in plain text
      const salt = await bcrypt.genSalt(10);  // Generate a salt
      user.password = await bcrypt.hash(password, salt);  // Hash the password and save it
    }

    if (role) user.role = role;
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


// Patch (partial update) user by ID
exports.patchUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Only HR can patch users
    const loggedInUser = req.user;
    if (loggedInUser.role !== 'hr') {
      return res.status(403).json({ message: 'Only HR can patch users' });
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User patched successfully', user });
  } catch (error) {
    console.error('Error patching user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Only HR can delete users
    const loggedInUser = req.user;
    if (loggedInUser.role !== 'hr') {
      return res.status(403).json({ message: 'Only HR can delete users' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
