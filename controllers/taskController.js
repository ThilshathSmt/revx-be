const Task = require('../models/Task');
const Goal = require('../models/Goal');
const User = require('../models/User');

// Manager assigns a new task to an employee
exports.createTask = async (req, res) => {
  const { projectId, taskTitle, startDate, dueDate, description, employeeId, priority } = req.body;

  try {
    // Validate if the Goal (Project) exists
    const project = await Goal.findById(projectId);
    if (!project) {
      return res.status(400).json({ message: 'Invalid projectId: Goal not found' });
    }

    // Validate if the Employee exists
    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== 'employee') {
      return res.status(400).json({ message: 'Invalid employeeId: Employee not found' });
    }

    // Create new task
    const newTask = new Task({
      projectId,
      taskTitle,
      startDate,
      dueDate,
      status: 'scheduled',
      description,
      managerId: req.user.id, // Manager is the user making the request
      priority,
      employeeId,
    });

    await newTask.save();
    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
};

// Get all tasks (Admin/Manager)
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('projectId').populate('employeeId').populate('managerId');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

// Get all tasks assigned to an employee
exports.getTasksForEmployee = async (req, res) => {
  try {
    const tasks = await Task.find({ employeeId: req.user.id }).populate('projectId');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

// Get a specific task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('projectId').populate('employeeId').populate('managerId');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    Object.assign(task, req.body); // Update the task with new data
    task.updatedAt = Date.now(); // Update timestamp

    await task.save();
    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
};
