const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register a new user (Create)
const registerUser = async (req, res) => {
  const { username, email, password, confirmPassword, role } = req.body;

  try {
    // Validate fields
    if (!username || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      confirmPassword,
      role
    });

    // Save user
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (Read)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single user by ID (Read)
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a user by ID (Update)
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, confirmPassword, role } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Handle password validation only if it's provided in the request body
    if (password || confirmPassword) {
      // Check if password and confirm password match
      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      // Hash the password if it's being updated
      user.password = await bcrypt.hash(password, 10);
      // Do not store confirmPassword
      user.confirmPassword = undefined;
    }

    // Update fields if provided, otherwise keep existing values
    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Delete a user by ID (Delete)
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user using deleteOne method
    await User.deleteOne({ _id: id });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
