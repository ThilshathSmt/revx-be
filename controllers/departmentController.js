const Department = require('../models/Department');

// Create a new department
exports.createDepartment = async (req, res) => {
  const { departmentName, description } = req.body;

  try {
    const newDepartment = new Department({
      departmentName,
      description,
      createdBy: req.user.id, // User (likely HR) who creates the department
    });

    await newDepartment.save();
    res.status(201).json({ message: 'Department created successfully', department: newDepartment });
  } catch (error) {
    res.status(500).json({ message: 'Error creating department', error });
  }
};

// Get all departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching departments', error });
  }
};
