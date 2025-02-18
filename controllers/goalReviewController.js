const Goal = require('../models/Goal');
const GoalReview = require('../models/GoalReview');
const User = require('../models/User');

// Create a new review cycle for a goal
exports.createReviewCycle = async (req, res) => {
  const { goalId, dueDate, managerId } = req.body;

  try {
    // Check if the goal exists
    const goal = await Goal.findById(goalId);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found.' });
    }

    // Ensure the manager exists
    const manager = await User.findById(managerId);
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found.' });
    }

    // Create a new review cycle entry for this goal
    const newReviewCycle = new GoalReview({
      goalId,
      managerId,
      hrAdminId: req.user.id, // HR Admin creating the review cycle
      dueDate,
      status: 'Pending', // Initial status set to Pending
      managerReview :"",
    });

    await newReviewCycle.save();
    res.status(201).json({ message: 'Review cycle created successfully', reviewCycle: newReviewCycle });
  } catch (error) {
    res.status(500).json({ message: 'Error creating review cycle', error });
  }
};

// Get all review cycles for the logged-in manager
exports.getManagerReviews = async (req, res) => {
  try {
    const reviews = await GoalReview.find({ managerId: req.user.id })
      .populate('goalId hrAdminId managerId')
      .exec();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching review cycles', error });
  }
};

// Manager provides a review for a specific review cycle
exports.provideReview = async (req, res) => {
  const { reviewCycleId, review } = req.body;

  try {
    // Find the review cycle
    const reviewCycle = await GoalReview.findById(reviewCycleId);
    if (!reviewCycle) {
      return res.status(404).json({ message: 'Review cycle not found.' });
    }

    // Ensure that the logged-in user is the assigned manager for this review cycle
    if (reviewCycle.managerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to provide a review for this cycle.' });
    }

    // Update the review cycle with the manager's review and mark it as Completed
    reviewCycle.managerReview = review;
    reviewCycle.status = 'Completed';

    await reviewCycle.save();
    res.status(200).json({ message: 'Review provided successfully', reviewCycle });
  } catch (error) {
    res.status(500).json({ message: 'Error providing review', error });
  }
};

// Get a specific review cycle by ID
exports.getReviewCycleById = async (req, res) => {
  try {
    const reviewCycle = await GoalReview.findById(req.params.id)
      .populate('goalId managerId hrAdminId')
      .exec();

    if (!reviewCycle) {
      return res.status(404).json({ message: 'Review cycle not found.' });
    }

    res.status(200).json(reviewCycle);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching review cycle', error });
  }
};

// Update the review cycle (HR/Admin functionality)
exports.updateReviewCycle = async (req, res) => {
  try {
    const updatedReviewCycle = await GoalReview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedReviewCycle) {
      return res.status(404).json({ message: 'Review cycle not found.' });
    }

    res.status(200).json({ message: 'Review cycle updated successfully', reviewCycle: updatedReviewCycle });
  } catch (error) {
    res.status(500).json({ message: 'Error updating review cycle', error });
  }
};

// Delete a review cycle (HR Admin only)
exports.deleteReviewCycle = async (req, res) => {
  try {
    const reviewCycle = await GoalReview.findById(req.params.id);
    if (!reviewCycle) {
      return res.status(404).json({ message: 'Review cycle not found' });
    }

    // Ensure only the HR Admin who created the review cycle can delete it
    if (reviewCycle.hrAdminId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only HR admin can delete this review cycle' });
    }

    await GoalReview.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Review cycle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review cycle', error });
  }
};
