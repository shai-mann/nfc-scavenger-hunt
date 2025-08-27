const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { query, testConnection } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "NFC Scavenger Hunt Server is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Get clue endpoint
app.get("/api/clues/:clueId", async (req, res) => {
  const { clueId } = req.params;

  try {
    const result = await query(
      'SELECT id, title, text, is_copyable as "isCopyable", image_url as image, location, points FROM clues WHERE id = $1',
      [clueId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Clue not found",
        message: `No clue found with ID: ${clueId}`,
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      error: "Database error",
      message: "Failed to retrieve clue",
    });
  }
});

// Get all clues endpoint
app.get("/api/clues", async (req, res) => {
  try {
    const result = await query(
      'SELECT id, title, text, is_copyable as "isCopyable", image_url as image, location, points, order_index FROM clues ORDER BY order_index'
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      error: "Database error",
      message: "Failed to retrieve clues",
    });
  }
});

// Create user endpoint
app.post("/api/users", async (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({
      error: "Missing required fields",
      message: "Username and email are required",
    });
  }

  try {
    const result = await query(
      'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id, username, email, created_at, total_points',
      [username, email]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Database error:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({
        error: "User already exists",
        message: "Username or email already taken",
      });
    }
    res.status(500).json({
      error: "Database error",
      message: "Failed to create user",
    });
  }
});

// Get user endpoint
app.get("/api/users/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await query(
      'SELECT id, username, email, created_at, total_points, current_clue_id FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
        message: `No user found with ID: ${userId}`,
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      error: "Database error",
      message: "Failed to retrieve user",
    });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to NFC Scavenger Hunt Server",
    endpoints: {
      health: "/health",
      clues: "/api/clues (GET all) or /api/clues/:clueId (GET one)",
      users: "/api/users (POST to create) or /api/users/:userId (GET one)",
      root: "/",
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    message: `The endpoint ${req.originalUrl} does not exist`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong on the server",
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 NFC Scavenger Hunt Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Sample clue: http://localhost:${PORT}/api/clues/clue-1`);
  
  // Test database connection
  await testConnection();
});
