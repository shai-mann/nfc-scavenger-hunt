const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { testConnection } = require("./db");

// Import routes
const userRoutes = require('./routes/users');
const clueRoutes = require('./routes/clues');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/clues', clueRoutes);

// Backwards compatibility - redirect old registration endpoint
app.post('/api/register', (req, res) => {
  res.redirect(307, '/api/users/register');
});

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
  console.log(`Sample clue: http://localhost:${PORT}/api/clues/clue-1`);

  // Test database connection
  await testConnection();
});
