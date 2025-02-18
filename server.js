const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const hrRoutes = require('./routes/hrRoutes');
const cors = require('cors');
// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Use CORS middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

//for department
const departmentRoutes = require('./routes/departmentRoutes');
app.use('/api/departments', departmentRoutes); // Routes for Department Management

//for goals
const goalRoutes = require('./routes/goalRoutes');
app.use('/api/goals',goalRoutes);

//for self assessment
const selfAssessmentRoutes = require('./routes/selfAssessmentRoutes');
app.use('/api/self-assessments', selfAssessmentRoutes);

//for feedback
const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/api/feedback', feedbackRoutes);


//for task
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);  // Routes for Task Management

// Routes
app.use('/api/auth', authRoutes); // Register authentication routes
app.use('/api/user', hrRoutes); // Register HR routes

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected...');
    const port = process.env.PORT || 5001;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => console.log('MongoDB connection error:', err));
