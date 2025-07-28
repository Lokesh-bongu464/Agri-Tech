const mongoose = require("mongoose");
const config = require("./index"); // Import general config

const connectDB = async () => {
  try {
    // This will now correctly use config.mongoURI
    await mongoose.connect(config.mongoURI, {
      // <-- Ensure it's config.mongoURI
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
