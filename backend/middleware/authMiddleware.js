const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/userModel"); // Import User model
const Admin = require("../models/adminModel"); // Import Admin model

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (format: "Bearer TOKEN")
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret);

      // --- CRITICAL CHANGE HERE: Fetch user based on role from decoded token ---
      if (decoded.role === "admin") {
        req.user = await Admin.findById(decoded.id).select("-password"); // Find in Admin model
      } else if (decoded.role === "user") {
        req.user = await User.findById(decoded.id).select("-password"); // Find in User model
      } else {
        // Handle unexpected roles or tokens without a role
        return res
          .status(401)
          .json({ message: "Not authorized, invalid token role." });
      }
      // --- END CRITICAL CHANGE ---

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found." });
      }

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error("Token verification failed:", error.message);
      // More specific error handling for common JWT errors
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Not authorized, token expired." });
      }
      if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ message: "Not authorized, invalid token." });
      }
      return res.status(401).json({ message: "Not authorized, token failed." });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token." });
  }
};

// Middleware to authorize based on roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // req.user.role is set by the protect middleware
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${
          req.user ? req.user.role : "none"
        } is not authorized to access this route.`,
      });
    }
    next();
  };
};
