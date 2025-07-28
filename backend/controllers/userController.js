const User = require("../models/userModel");
const bcrypt = require("bcryptjs"); // For password comparison
const jwt = require("jsonwebtoken"); // For JWT token generation
const config = require("../config"); // For JWT secret

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // Create new user (password hashing handled by pre-save hook in model)
    user = new User({ name, email, password, role: "user" }); // Default role is 'user'
    await user.save();

    // Generate JWT token for immediate login after registration
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Payload: user ID and role
      config.jwtSecret,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(201).json({
      message: "User account created successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error during registration." });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials." }); // Use generic message for security
    }

    // Check password
    const isMatch = await user.matchPassword(password); // Using the method defined in userModel

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." }); // Use generic message for security
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: "7d" } // Changed from '1h' to '7d'
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res.status(500).json({ message: "Server error during login." });
  }
};

// @desc    Get user profile (example of a protected route)
// @route   GET /api/users/profile
// @access  Private (User)
exports.getUserProfile = async (req, res) => {
  try {
    // req.user is set by the authMiddleware after token verification
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (User)
exports.updateUserProfile = async (req, res) => {
  const { name, email, password } = req.body; // User can update their own profile

  try {
    // req.user.id comes from the authenticated user's token
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update fields only if they are provided
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;

    // Password will be hashed by the pre-save hook if modified
    if (password !== undefined && password.length > 0) {
      user.password = password; // The pre-save hook will hash this
    }

    const updatedUser = await user.save();

    // Do not send password back
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error." });
  }
};
