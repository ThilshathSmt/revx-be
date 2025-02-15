const Goal = require('../models/Goal');
const User = require('../models/User');
const Department = require('../models/Department');

// HR creates a new goal for a manager
exports.createGoal = async (req, res) => {
  const { projectTitle, startDate, dueDate, description, departmentId, managerId } = req.body;

  try {
    const manager = await User.findById(managerId);
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found. Please provide a valid manager ID.' });
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found. Please provide a valid department ID.' });
    }
    
    const newGoal = new Goal({
      projectTitle,
      startDate,
      dueDate,
      status: 'scheduled',
      description,
      departmentId,
      hrId: req.user.id, // HR is the user making the request
      managerId,
    });

    await newGoal.save();
    res.status(201).json({ message: 'Goal created successfully', goal: newGoal });
  } catch (error) {
    res.status(500).json({ message: 'Error creating goal', error });
  }
};

// Get all goals (for admin or HR)
exports.getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.find().populate('managerId hrId departmentId');
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goals', error });
  }
};

// Get all goals assigned to a specific manager
exports.getGoalsForManager = async (req, res) => {
  try {
    const goals = await Goal.find({ managerId: req.user.id }).populate('hrId departmentId');
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goals', error });
  }
};

// Get a specific goal by ID
exports.getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id).populate('managerId hrId departmentId');
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goal', error });
  }
};

// Update a goal (HR or Manager can update)
exports.updateGoal = async (req, res) => {
  try {
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.status(200).json({ message: 'Goal updated successfully', goal: updatedGoal });
  } catch (error) {
    res.status(500).json({ message: 'Error updating goal', error });
  }
};

// Delete a goal (HR can delete)
exports.deleteGoal = async (req, res) => {
  try {
    const deletedGoal = await Goal.findByIdAndDelete(req.params.id);
    if (!deletedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting goal', error });
  }
};
