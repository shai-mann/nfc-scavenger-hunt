import cors from "cors";
import dotenv from "dotenv";
import "dotenv/config";
import express from "express";
import { testConnection } from "./db";

// Import routes
import clueRoutes from "./routes/clues";
import userRoutes from "./routes/users";

// Import middleware
import { errorHandler } from "./middleware/errorHandler";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/clues", clueRoutes);

// Basic health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "NFC Scavenger Hunt Server is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    message: `The endpoint ${req.originalUrl} does not exist`,
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  console.log(`NFC Scavenger Hunt Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API documentation: http://localhost:${PORT}/api`);

  // Test database connection
  await testConnection();
});
