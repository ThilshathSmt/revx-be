const Goal = require('../models/Goal');
const User = require('../models/User');
const Team = require('../models/Team');
const Department = require('../models/Department');

// Manager creates goal for their team
exports.createGoal = async (req, res) => {
  const { projectTitle, startDate, dueDate, description, teamId, departmentId } = req.body;

  try {
    // Validate manager exists
    const manager = await User.findById(req.user.id);
    if (!manager || manager.role !== 'manager') {
      return res.status(403).json({ message: 'Manager access required' });
    }

    // Validate team exists and manager is assigned
    const team = await Team.findOne({ 
      _id: teamId
    });
    if (!team) {
      return res.status(404).json({ message: 'Team not found under your management' });
    }

    // Validate department exists
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const newGoal = new Goal({
      projectTitle,
      startDate,
      dueDate,
      status: 'scheduled',
      description,
      teamId,
      departmentId,
      managerId: req.user.id
    });

    await newGoal.save();
    
    res.status(201).json({ 
      message: 'Goal created successfully', 
      goal: await Goal.findById(newGoal._id)
        .populate('teamId', 'teamName')
        .populate('managerId', 'username')
        .populate('departmentId', 'departmentName')
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating goal', error });
  }
};

// Get all goals
exports.getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.find()
      .populate('teamId', 'teamName')
      .populate('managerId', 'username')
      .populate('departmentId', 'departmentName');

    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goals', error });
  }
};

// Get goals for a specific team
exports.getTeamGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ teamId: req.params.teamId })
      .populate('teamId', 'teamName')
      .populate('managerId', 'username')
      .populate('departmentId', 'departmentName');
      
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team goals', error });
  }
};

// Update goal (manager only)
exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      managerId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found or unauthorized' });
    }

    // Validate department if being updated
    if (req.body.departmentId) {
      const department = await Department.findById(req.body.departmentId);
      if (!department) {
        return res.status(404).json({ message: 'Department not found' });
      }
      goal.departmentId = req.body.departmentId;
    }

    // Update other fields
    if (req.body.projectTitle) goal.projectTitle = req.body.projectTitle;
    if (req.body.startDate) goal.startDate = req.body.startDate;
    if (req.body.dueDate) goal.dueDate = req.body.dueDate;
    if (req.body.status) goal.status = req.body.status;
    if (req.body.description) goal.description = req.body.description;

    await goal.save();
    
    res.status(200).json({ 
      message: 'Goal updated successfully',
      goal: await Goal.findById(goal._id)
        .populate('teamId', 'teamName')
        .populate('departmentId', 'departmentName')
        .populate('managerId', 'username')
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating goal', error });
  }
};

// Delete goal (manager only)
exports.deleteGoal = async (req, res) => {
  try {
    const deletedGoal = await Goal.findOneAndDelete({
      _id: req.params.id,
      managerId: req.user.id
    });

    if (!deletedGoal) {
      return res.status(404).json({ message: 'Goal not found or unauthorized' });
    }
    
    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting goal', error });
  }
};
