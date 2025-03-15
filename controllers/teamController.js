const Team = require('../models/Team');
const User = require('../models/User');
const Department = require('../models/Department');
const mongoose = require('mongoose');

// Create new Team with members
exports.createTeam = async (req, res) => {
    const { teamName, members = [], departmentId } = req.body; // Default to empty array

    try {
        // Validate members only if provided
        if (members.length > 0) {
            const validMembers = await User.find({ _id: { $in: members } });
            if (validMembers.length !== members.length) {
                return res.status(400).json({ message: 'Invalid member IDs' });
            }
        }

        // Validate department if provided
        if (departmentId) {
            if (!mongoose.Types.ObjectId.isValid(departmentId)) {
                return res.status(400).json({ message: 'Invalid department ID' });
            }

            // Check if department exists
            const existingDepartment = await Department.findById(departmentId);
            if (!existingDepartment) {
                return res.status(400).json({ message: 'Department not found' });
            }
        }

        const newTeam = new Team({
            teamName,
            members,
            createdBy: req.user.id,
            departmentId,
        });

        await newTeam.save();
        
        // Return the team with members and department fields
        res.status(201).json({ 
            message: 'Team created successfully', 
            team: await Team.findById(newTeam._id)
                .populate('members', 'username')
                .populate('departmentId', 'departmentName')
        });
    } catch (error) {
        console.error("Error creating team:", error);
        res.status(500).json({ message: 'Error creating team', error: error.message });
    }
};

// Get all Teams with populated members and department
exports.getTeams = async (req, res) => {
    try {
        const teams = await Team.find()
            .populate('createdBy', 'username')
            .populate('members', 'username email role')
            .populate('departmentId', 'departmentName');  // Fixed department field name
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teams', error });
    }
};

// Update team including members and department
exports.updateTeam = async (req, res) => {
    const { teamName, members, departmentId } = req.body;

    try {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Validate members if provided
        if (members && members.length > 0) {
            const validMembers = await User.find({ _id: { $in: members } });
            if (validMembers.length !== members.length) {
                return res.status(400).json({ message: 'Invalid member IDs' });
            }
            team.members = members;
        }

        // Validate department if provided
        if (departmentId) {
            if (!mongoose.Types.ObjectId.isValid(departmentId)) {
                return res.status(400).json({ message: 'Invalid department ID' });
            }

            const existingDepartment = await Department.findById(departmentId);
            if (!existingDepartment) {
                return res.status(400).json({ message: 'Department not found' });
            }

            team.departmentId = department;
        }

        if (teamName) team.teamName = teamName;
        team.updatedAt = Date.now();

        const updatedTeam = await team.save();
        res.status(200).json({ 
            message: 'Team updated successfully', 
            team: await Team.findById(updatedTeam._id)
                .populate('members', 'username')
                .populate('department', 'departmentName')
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating team', error });
    }
};

// Get specific team by ID with populated members and department
exports.getTeamById = async (req, res) => {
    try {
      // Validate team ID format
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid team ID format' });
      }
  
      const team = await Team.findById(req.params.id)
        .populate('members', 'username email role')
        .populate('createdBy', 'username')
        .populate('departmentId', 'departmentName');  // Fixed department field name
  
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
      
      res.status(200).json(team);
    } catch (error) {
      console.error("Team fetch error:", error);
      res.status(500).json({ 
        message: 'Error fetching team details',
        error: error.message 
      });
    }
};

// Delete team remains the same
exports.deleteTeam = async (req, res) => {
    try {
        const team = await Team.findByIdAndDelete(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.status(200).json({ message: 'Team deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting Team', error });
    }
};
