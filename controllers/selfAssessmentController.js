const SelfAssessment = require('../models/SelfAssessment');
const Task = require('../models/Task');
const Goal = require('../models/Goal');

const selfAssessmentController = {
    // Submit a new self-assessment
    submitAssessment: async (req, res) => {
        try {
            const { taskId, comments } = req.body;
            const employeeId = req.user.id; // From auth middleware

            // Basic validation
            if (!taskId) {
                return res.status(400).json({ message: 'Task ID is required' });
            }

            // Check if the task exists and is assigned to the employee
            const task = await Task.findOne({
                _id: taskId,
                employeeId: employeeId,
                status: 'completed'
            });

            if (!task) {
                return res.status(404).json({
                    message: 'Task not found or not assigned to you, or task not completed'
                });
            }

            // Check if assessment already exists for this task
            const existingAssessment = await SelfAssessment.findOne({
                taskId: taskId,
                employeeId: employeeId
            });

            if (existingAssessment) {
                return res.status(400).json({
                    message: 'Self-assessment already submitted for this task'
                });
            }

            // Create new assessment
            const newAssessment = new SelfAssessment({
                employeeId: employeeId,
                managerId: task.managerId,
                taskId: taskId,
                comments: comments,
                updatedAt: Date.now()
            });

            await newAssessment.save();

            res.status(201).json({
                message: 'Self-assessment submitted successfully',
                assessment: newAssessment
            });

        } catch (error) {
            console.error('Error submitting self-assessment:', error);
            res.status(500).json({ 
                message: 'Server error', 
                error: error.message 
            });
        }
    },

    // Edit an existing self-assessment
    editAssessment: async (req, res) => {
        try {
            const { id } = req.params;
            const { comments } = req.body;
            const employeeId = req.user.id;

            // Find the assessment
            const assessment = await SelfAssessment.findById(id);

            if (!assessment) {
                return res.status(404).json({ 
                    message: 'Assessment not found' 
                });
            }

            // Check if the assessment belongs to the employee
            if (assessment.employeeId.toString() !== employeeId) {
                return res.status(403).json({ 
                    message: 'Not authorized to edit this assessment' 
                });
            }

            // Update the assessment
            assessment.comments = comments || assessment.comments;
            assessment.updatedAt = Date.now();

            await assessment.save();

            res.status(200).json({
                message: 'Assessment updated successfully',
                assessment
            });

        } catch (error) {
            console.error('Error editing self-assessment:', error);
            res.status(500).json({ 
                message: 'Server error', 
                error: error.message 
            });
        }
    },

    // Get all self-assessments for a manager
    getManagerAssessments: async (req, res) => {
        try {
            const managerId = req.user.id;

            const assessments = await SelfAssessment.find({ managerId })
                .populate({
                    path: 'employeeId',
                    select: 'name email'
                })
                .populate({
                    path: 'taskId',
                    select: 'taskTitle dueDate status'
                })
                .sort({ createdAt: -1 });

            res.status(200).json(assessments);

        } catch (error) {
            console.error('Error getting manager assessments:', error);
            res.status(500).json({ 
                message: 'Server error', 
                error: error.message 
            });
        }
    },

    // Get a specific self-assessment by ID
    getAssessmentById: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const assessment = await SelfAssessment.findById(id)
                .populate({
                    path: 'employeeId',
                    select: 'name email'
                })
                .populate({
                    path: 'taskId',
                    select: 'taskTitle dueDate status'
                })
                .populate({
                    path: 'managerId',
                    select: 'name email'
                });

            if (!assessment) {
                return res.status(404).json({ 
                    message: 'Assessment not found' 
                });
            }

            // Check if the user is the employee, manager, or admin
            if (assessment.employeeId._id.toString() !== userId && 
                assessment.managerId._id.toString() !== userId) {
                return res.status(403).json({ 
                    message: 'Not authorized to view this assessment' 
                });
            }

            res.status(200).json(assessment);

        } catch (error) {
            console.error('Error getting assessment by ID:', error);
            res.status(500).json({ 
                message: 'Server error', 
                error: error.message 
            });
        }
    },

    // Delete a self-assessment
    deleteAssessment: async (req, res) => {
        try {
            const { id } = req.params;
            const employeeId = req.user.id;

            const assessment = await SelfAssessment.findById(id);

            if (!assessment) {
                return res.status(404).json({ 
                    message: 'Assessment not found' 
                });
            }

            // Check if the assessment belongs to the employee
            if (assessment.employeeId.toString() !== employeeId) {
                return res.status(403).json({ 
                    message: 'Not authorized to delete this assessment' 
                });
            }

            await SelfAssessment.findByIdAndDelete(id);

            res.status(200).json({ 
                message: 'Assessment deleted successfully' 
            });

        } catch (error) {
            console.error('Error deleting assessment:', error);
            res.status(500).json({ 
                message: 'Server error', 
                error: error.message 
            });
        }
    },

    // Get all self-assessments for an employee (both pending and submitted)
    getEmployeeAssessments: async (req, res) => {
        try {
            const employeeId = req.user.id;

            // Get all completed tasks assigned to the employee
            const completedTasks = await Task.find({
                employeeId: employeeId,
                status: 'completed'
            }).select('_id taskTitle dueDate');

            // Get all submitted assessments
            const submittedAssessments = await SelfAssessment.find({ employeeId })
                .populate({
                    path: 'taskId',
                    select: 'taskTitle dueDate'
                })
                .sort({ createdAt: -1 });

            // Find tasks that are completed but don't have assessments yet (pending)
            const submittedTaskIds = submittedAssessments.map(a => a.taskId._id.toString());
            const pendingTasks = completedTasks.filter(
                task => !submittedTaskIds.includes(task._id.toString())
            );

            res.status(200).json({
                submittedAssessments,
                pendingTasks
            });

        } catch (error) {
            console.error('Error getting employee assessments:', error);
            res.status(500).json({ 
                message: 'Server error', 
                error: error.message 
            });
        }
    }
};

module.exports = selfAssessmentController;