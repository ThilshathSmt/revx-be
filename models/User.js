const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['employee', 'manager', 'hr'], // Define valid roles
  },
  profilePicture: {
    data: Buffer,  // To store the image as binary data
    contentType: String  // To store the file's MIME type
},
  employeeDetails: {
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department',required:false },
    designation: { type: String },
    joiningDate: { type: Date },
    // Add more fields as required for employees
  },
  managerDetails: {
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department',required:false },
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team',required:false }], // Reference to employees
    // Add more fields as required for managers
  },
  hrDetails: {
    assignedDepartments: [{ type:String }],
    // Add more fields as required for HR
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User', UserSchema);