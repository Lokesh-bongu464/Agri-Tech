require("dotenv").config(); // Keep this line!

module.exports = {
  port: process.env.PORT || 7000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || "supersecretjwtkey", // This will now correctly pick up 'mydevsecretkey'
  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : ["http://localhost:5173"],
};
