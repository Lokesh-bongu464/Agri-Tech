const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const config = require("./config");
const mainRouter = require("./routes");

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// --- CRITICAL CORS CHANGE FOR DEBUGGING ---
app.use(
  cors({
    origin: "*", // Allow all origins (for debugging ONLY)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow OPTIONS for preflight
    allowedHeaders: ["Content-Type", "Authorization"], // Allow common headers including Authorization
    credentials: true, // Allow cookies/auth headers
  })
);
// --- END CRITICAL CORS CHANGE ---

app.use(helmet());

// Define Routes
app.use("/api", mainRouter);

// Simple root route (optional, good for health checks)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = config.port;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
