const Feedback = require('../models/Feedback');
const SelfAssessment = require('../models/SelfAssessment');

const feedbackController = {
    // Submit feedback for a self-assessment
    submitFeedback: async (req, res) => {
        try {
            const { selfAssessmentId, feedbackText } = req.body;
            const managerId = req.user.id;

            // Validate input
            if (!selfAssessmentId || !feedbackText) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Self assessment ID and feedback text are required' 
                });
            }

            // Check if the self-assessment exists
            const selfAssessment = await SelfAssessment.findById(selfAssessmentId)
                .populate('employeeId', 'name email')
                .populate('taskId', 'taskTitle');

            if (!selfAssessment) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Self assessment not found' 
                });
            }

            // Check if manager is authorized
            if (selfAssessment.managerId.toString() !== managerId && req.user.role !== 'admin') {
                return res.status(403).json({ 
                    success: false,
                    message: 'Not authorized to provide feedback for this assessment' 
                });
            }

            // Check if feedback already exists
            const existingFeedback = await Feedback.findOne({ selfAssessmentId });
            if (existingFeedback) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Feedback already exists for this assessment' 
                });
            }

            // Create new feedback
            const newFeedback = new Feedback({
                selfAssessmentId,
                managerId,
                feedbackText,
                status: 'submitted'
            });

            await newFeedback.save();

            // Update the self-assessment with feedback reference
            selfAssessment.feedback = newFeedback._id;
            await selfAssessment.save();

            res.status(201).json({
                success: true,
                message: 'Feedback submitted successfully',
                feedback: newFeedback
            });

        } catch (error) {
            console.error('Error submitting feedback:', error);
            res.status(500).json({ 
                success: false,
                message: 'Server error while submitting feedback',
                error: error.message 
            });
        }
    },

    // Edit existing feedback
    editFeedback: async (req, res) => {
        try {
            const { id } = req.params;
            const { feedbackText } = req.body;
            const managerId = req.user.id;

            if (!feedbackText) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Feedback text is required' 
                });
            }

            // Find the feedback
            const feedback = await Feedback.findById(id);
            if (!feedback) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Feedback not found' 
                });
            }

            // Check authorization
            if (feedback.managerId.toString() !== managerId && req.user.role !== 'admin') {
                return res.status(403).json({ 
                    success: false,
                    message: 'Not authorized to edit this feedback' 
                });
            }

            // Update feedback
            feedback.feedbackText = feedbackText;
            feedback.status = 'updated';
            feedback.updatedAt = Date.now();
            await feedback.save();

            res.status(200).json({
                success: true,
                message: 'Feedback updated successfully',
                feedback
            });

        } catch (error) {
            console.error('Error editing feedback:', error);
            res.status(500).json({ 
                success: false,
                message: 'Server error while editing feedback',
                error: error.message 
            });
        }
    },

    // Get all feedbacks for manager
    getManagerFeedbacks: async (req, res) => {
        try {
            const managerId = req.user.id;

            // Get pending assessments (without feedback)
            const pendingAssessments = await SelfAssessment.find({
                managerId,
                feedback: { $exists: false },
                status: 'completed'
            })
            .populate('employeeId', 'name email')
            .populate('taskId', 'taskTitle');

            // Get given feedbacks
            const givenFeedbacks = await Feedback.find({ managerId })
                .populate({
                    path: 'selfAssessmentId',
                    populate: [
                        { path: 'employeeId', select: 'name email' },
                        { path: 'taskId', select: 'taskTitle' }
                    ]
                })
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                pendingAssessments,
                givenFeedbacks
            });

        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            res.status(500).json({ 
                success: false,
                message: 'Server error while fetching feedbacks',
                error: error.message 
            });
        }
    },

    // Get feedback for specific assessment
    getFeedbackByAssessmentId: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            // Find the self-assessment
            const selfAssessment = await SelfAssessment.findById(id)
                .populate('employeeId', 'name email')
                .populate('managerId', 'name email')
                .populate('taskId', 'taskTitle');

            if (!selfAssessment) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Self assessment not found' 
                });
            }

            // Check authorization
            const isEmployee = selfAssessment.employeeId._id.toString() === userId;
            const isManager = selfAssessment.managerId._id.toString() === userId;
            const isAdmin = req.user.role === 'admin';
            
            if (!isEmployee && !isManager && !isAdmin) {
                return res.status(403).json({ 
                    success: false,
                    message: 'Not authorized to view this feedback' 
                });
            }

            // Find the feedback
            const feedback = await Feedback.findOne({ selfAssessmentId: id })
                .populate('managerId', 'name email');

            res.status(200).json({
                success: true,
                feedback: feedback || null,
                selfAssessment
            });

        } catch (error) {
            console.error('Error fetching feedback:', error);
            res.status(500).json({ 
                success: false,
                message: 'Server error while fetching feedback',
                error: error.message 
            });
        }
    },

    // Get feedback by self-assessment ID (new endpoint)
    getFeedbackBySelfAssessmentId: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            // Find the self-assessment
            const selfAssessment = await SelfAssessment.findById(id);
            if (!selfAssessment) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Self assessment not found' 
                });
            }

            // Check authorization - only the employee or manager can view
            if (selfAssessment.employeeId.toString() !== userId && 
                selfAssessment.managerId.toString() !== userId && 
                req.user.role !== 'admin') {
                return res.status(403).json({ 
                    success: false,
                    message: 'Not authorized to view this feedback' 
                });
            }

            // Find the feedback
            const feedback = await Feedback.findOne({ selfAssessmentId: id })
                .populate('managerId', 'name email');

            res.status(200).json({
                success: true,
                feedback: feedback || null
            });

        } catch (error) {
            console.error('Error fetching feedback:', error);
            res.status(500).json({ 
                success: false,
                message: 'Server error while fetching feedback',
                error: error.message 
            });
        }
    },

    // Delete feedback
    deleteFeedback: async (req, res) => {
        try {
            const { id } = req.params;
            const managerId = req.user.id;

            const feedback = await Feedback.findById(id);
            if (!feedback) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Feedback not found' 
                });
            }

            // Check authorization
            if (feedback.managerId.toString() !== managerId && req.user.role !== 'admin') {
                return res.status(403).json({ 
                    success: false,
                    message: 'Not authorized to delete this feedback' 
                });
            }

            // Remove feedback reference from self-assessment
            await SelfAssessment.updateOne(
                { _id: feedback.selfAssessmentId },
                { $unset: { feedback: "" } }
            );

            // Delete the feedback
            await Feedback.findByIdAndDelete(id);

            res.status(200).json({
                success: true,
                message: 'Feedback deleted successfully'
            });

        } catch (error) {
            console.error('Error deleting feedback:', error);
            res.status(500).json({ 
                success: false,
                message: 'Server error while deleting feedback',
                error: error.message 
            });
        }
    }
};

module.exports = feedbackController;