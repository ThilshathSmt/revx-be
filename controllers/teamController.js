const Team = require('../models/Team');

//Creating new Team
exports.createTeam = async (req, res) =>{
    const { teamName } = req.body;

    try{
        const newTeam = new Team({
            teamName,
            createdBy: req.user.id,
        });

        await newTeam.save();
        res.status(201).json({message: 'Team created Successfully', team: newTeam});
    }
    catch(error){
        res.status(500).json({message:'Error creating team',error});
    }
};

//get all Teams
exports.getTeams = async (req,res) =>{
    try{
        const teams=await Team.find().populate('createdBy','username');
        res.status(201).json(teams);
    }
    catch(error){
        res.status(500).json({message:'Error fetching teams',error});
    }
};

// Get a specific team by ID
exports.getTeamById = async (req, res) => {
    try {
      const team = await Team.findById(req.params.id).populate('createdBy', 'username');
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
      res.status(200).json(team);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching Team', error });
    }
  };
  
  // Update a team
  exports.updateTeam = async (req, res) => {
    const { teamName } = req.body;
  
    try {
      const team = await Team.findById(req.params.id);
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
  
      // Update fields
      if (teamName) team.teamName = teamName;
      team.updatedAt = Date.now();
  
      await team.save();
      res.status(200).json({ message: 'Team updated successfully', team });
    } catch (error) {
      res.status(500).json({ message: 'Error updating team', error });
    }
  };
  
  // Delete a team
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