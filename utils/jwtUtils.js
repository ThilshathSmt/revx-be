// const jwt = require('jsonwebtoken');

// const generateToken = (userId) => {
//   return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '10d' });
// };

// module.exports = generateToken;

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// JWT secret key (from .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';  // Default secret key if not set

// Function to generate a JWT token
const generateToken = (user) => {
  // You can customize the payload with necessary user data
  const payload = {
    id: user._id,
    username: user.username,
    role: user.role,
  };

  // Generate token with an expiration time (e.g., 1 hour)
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  return token;
};

// Function to verify a JWT token
const verifyToken = (token) => {
  try {
    // Verify the token and return the decoded data
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error('Token is not valid or expired');
  }
};

// Function to decode a JWT token without verifying (use cautiously)
const decodeToken = (token) => {
  try {
    // Decode the token to get the payload without verification
    const decoded = jwt.decode(token);
    return decoded;
  } catch (err) {
    throw new Error('Unable to decode the token');
  }
};

// Function to check if a token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }
    // Check if the token's expiry time is before the current time
    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    return currentTime > expirationTime;
  } catch (err) {
    throw new Error('Unable to check token expiration');
  }
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  isTokenExpired,
};
