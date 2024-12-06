const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); // Import mongoose
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const goalRoutes = require('./routes/goalRoutes');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use('/api/auth', authRoutes); // Register routes
app.use('/api/goals', goalRoutes);

// Connect to MongoDB and start the server
mongoose.connect('mongodb://localhost:27017/revx_be_1', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected...');
    app.listen(5002, () => {
      console.log('Server running on port 5002');
    });
  })
  .catch((err) => console.log(err));
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
