const mongoose = require('mongoose');

const goalReviewSchema = new mongoose.Schema({
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal', // Each goal has one review cycle
    required: true,
    unique: true, // Ensures one review per goal
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The manager assigned to review the goal
    required: true,
  },
  dueDate: {
    type: Date,
    required: true, // The deadline for review
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending', // Tracks if the review is done
  },
  managerReview: {
    type: String,
    trim: true, //Review  from the manager
  },
  hrAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // HR Admin who assigns the review
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

// Middleware to update `updatedAt` before saving
goalReviewSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const GoalReview = mongoose.model('GoalReview', goalReviewSchema);

module.exports = GoalReview;
