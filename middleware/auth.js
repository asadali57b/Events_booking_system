const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  const splitToken = token.split(' ')[1];

  try {
    const decoded = jwt.verify(splitToken, 'userData'); 
    req.user = decoded; 

    
    if (decoded.id) {
      req.user._id = decoded.id;
    }

    console.log("Decoded Token:", req.user); 

    next(); 
  } catch (ex) {
    console.error("Token verification failed:", ex.message);

    if (ex.name === 'TokenExpiredError') {
      return res.status(400).json({ success: false, message: "Token expired" });
    } else if (ex.name === 'JsonWebTokenError') {
      return res.status(400).json({ success: false, message: "Invalid token" });
    } else {
      return res.status(400).json({ success: false, message: "Token verification failed" });
    }
  }
}

module.exports = auth;
