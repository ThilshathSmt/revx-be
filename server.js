const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // To parse incoming JSON requests

// Sample route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

const PORT = process.env.PORT || 5001;  // Change to another port (e.g., 5001)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

