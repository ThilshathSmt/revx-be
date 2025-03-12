const Team = require('../models/Team');
const User = require('../models/User');

// Create new Team with members
exports.createTeam = async (req, res) => {
    const { teamName, members = [] } = req.body; // Default to empty array

    try {
        // Validate members only if provided
        if (members.length > 0) {
            const validMembers = await User.find({ _id: { $in: members } });
            if (validMembers.length !== members.length) {
                return res.status(400).json({ message: 'Invalid member IDs' });
            }
        }

        const newTeam = new Team({
            teamName,
            members,
            createdBy: req.user.id,
        });

        await newTeam.save();
        
        // Return the team with members field
        res.status(201).json({ 
            message: 'Team created successfully', 
            team: await Team.findById(newTeam._id)
                .populate('members', 'username')
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating team', error });
    }
};

// Get all Teams with populated members
exports.getTeams = async (req, res) => {
    try {
        const teams = await Team.find()
            .populate('createdBy', 'username')
            .populate('members', 'username email role');
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teams', error });
    }
};

// Update team including members
exports.updateTeam = async (req, res) => {
    const { teamName, members } = req.body;

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

        if (teamName) team.teamName = teamName;
        team.updatedAt = Date.now();

        const updatedTeam = await team.save();
        res.status(200).json({ 
            message: 'Team updated successfully', 
            team: await Team.findById(updatedTeam._id)
                .populate('members', 'username')
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating team', error });
    }
};

// Get specific team by ID with populated members
exports.getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate('createdBy', 'username')
            .populate('members', 'username email role');

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.status(200).json(team);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Team', error });
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
