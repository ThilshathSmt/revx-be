// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// // Create User Schema
// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     lowercase: true,
//     match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6
//   },
//   confirmPassword: {
//     type: String
//   },
//   role: {
//     type: String,
//     enum: ['hr', 'manager', 'employee'],
//     required: true
//   }
// });

// // Middleware to hash password before saving
// userSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 10);
//     this.confirmPassword = undefined; // No need to store confirmPassword
//   }
//   next();
// });

// // Compare password method
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model('User', userSchema);

// module.exports = User;

const mongoose = require('mongoose');

// Create User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  confirmPassword: {
    type: String
  },
  role: {
    type: String,
    enum: ['hr', 'manager', 'employee'],
    required: true
  }
});

// No pre-save middleware to hash password
// No password comparison method needed

const User = mongoose.model('User', userSchema);

module.exports = User;
