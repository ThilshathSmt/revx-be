const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  projectTitle: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed'],
    default: 'scheduled',
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User (Manager)
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true, // This should refer to a department model if it exists
    ref: 'Department',
  },
  hrId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the HR user who created the goal
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to set updatedAt before saving
goalSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
