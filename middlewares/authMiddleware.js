const authenticateUser = (req, res, next) => {
    console.log(req.headers);
    const token = req.headers.authorization?.split(' ')[1]; // Expecting 'Bearer <token>'
    if (!token) {
      return res.status(401).json({ message: 'No token provided. Access denied.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual secret
      req.user = decoded; // Add decoded user info to the request
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token.' });
    }
  };
  
  module.exports = {
    authenticateUser,
  };
  