const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    // The userId field seems redundant for an Admin schema if it refers to a 'user' model
    // For now, keeping it as per your original schema, but it might need re-evaluation.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // --- CRITICAL ADDITION: Define the role field for Admin ---
    role: {
      type: String,
      enum: ["admin"], // Admins should only have the 'admin' role
      default: "admin",
    },
    // --- END CRITICAL ADDITION ---
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password before saving
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
AdminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", AdminSchema);
