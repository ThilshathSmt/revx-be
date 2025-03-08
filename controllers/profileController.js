const User = require('../models/User');
const path = require('path');
const upload = require('../config/storageConfig');

exports.uploadProfilePicture = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Ensure the profile picture path is stored correctly
            user.profilePicture = `uploads/${req.file.filename}`;
            await user.save();

            res.status(200).json({ 
                message: 'Profile picture uploaded successfully', 
                profilePicture: `/${user.profilePicture}`  // Ensure the frontend gets the correct path
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update profile' });
        }
    });
};

exports.getProfilePicture = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.profilePicture) {
            return res.status(404).json({ message: 'Profile picture not found' });
        }

        // Construct the correct image path
        res.status(200).json({ profilePicture: `/${user.profilePicture}` });
    } catch (error) {
        console.error('Error retrieving profile picture:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};