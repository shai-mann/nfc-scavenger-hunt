const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { query, testConnection } = require("./db");

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

/* USER ENDPOINTS */

// User registration endpoint (username only)
app.post("/api/register", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({
      error: "Missing required fields",
      message: "Username is required",
    });
  }

  if (username.length < 3 || username.length > 50) {
    return res.status(400).json({
      error: "Invalid username",
      message: "Username must be between 3 and 50 characters",
    });
  }

  try {
    const result = await query(
      "INSERT INTO users (username) VALUES ($1) RETURNING id, username, created_at",
      [username]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);
    if (error.code === "23505") {
      // Unique violation
      return res.status(409).json({
        error: "Username taken",
        message: "This username is already registered",
      });
    }
    res.status(500).json({
      error: "Database error",
      message: "Failed to register user",
    });
  }
});

/* CLUE ENDPOINTS */

// Get clue endpoint (requires unlock verification)
app.get("/api/clues/:clueId", async (req, res) => {
  const { clueId } = req.params;
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      error: "Missing user ID",
      message: "User ID is required to view clues",
    });
  }

  try {
    // Check if user exists
    const userResult = await query("SELECT id FROM users WHERE id = $1", [
      userId,
    ]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
        message: "Invalid user ID",
      });
    }

    // Check if clue exists
    const clueResult = await query(
      'SELECT id, title, text, is_copyable as "isCopyable", image_url as image, location FROM clues WHERE id = $1',
      [clueId]
    );

    if (clueResult.rows.length === 0) {
      return res.status(404).json({
        error: "Clue not found",
        message: `No clue found with ID: ${clueId}`,
      });
    }

    // Check if user has unlocked this clue
    const progressResult = await query(
      "SELECT completed_at FROM user_progress WHERE user_id = $1 AND clue_id = $2",
      [userId, clueId]
    );

    if (progressResult.rows.length === 0) {
      return res.status(403).json({
        error: "Clue locked",
        message: "You must unlock this clue before viewing it",
      });
    }

    res.json({
      success: true,
      data: {
        ...clueResult.rows[0],
        unlockedAt: progressResult.rows[0].completed_at,
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Database error",
      message: "Failed to retrieve clue",
    });
  }
});

// Get user's unlocked clues endpoint
app.get("/api/clues", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      error: "Missing user ID",
      message: "User ID is required to view clues",
    });
  }

  try {
    // Check if user exists
    const userResult = await query("SELECT id FROM users WHERE id = $1", [
      userId,
    ]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
        message: "Invalid user ID",
      });
    }

    // Get all clues the user has unlocked
    const result = await query(
      `
      SELECT c.title, c.order_index
      FROM clues c
      INNER JOIN user_progress up ON c.id = up.clue_id
      WHERE up.user_id = $1
      ORDER BY c.order_index
    `,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Database error",
      message: "Failed to retrieve clues",
    });
  }
});

// Clue unlock endpoint
app.post("/api/clues/:clueId/unlock", async (req, res) => {
  const { clueId } = req.params;
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({
      error: "Missing required fields",
      message: "User ID and password are required",
    });
  }

  try {
    // Check if user exists
    const userResult = await query("SELECT id FROM users WHERE id = $1", [
      userId,
    ]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
        message: "Invalid user ID",
      });
    }

    // Check if clue exists and get its details
    const clueResult = await query(
      "SELECT id, password, lock_state, order_index FROM clues WHERE id = $1",
      [clueId]
    );

    if (clueResult.rows.length === 0) {
      return res.status(404).json({
        error: "Clue not found",
        message: `No clue found with ID: ${clueId}`,
      });
    }

    const clue = clueResult.rows[0];

    // Check if user already unlocked this clue
    const progressResult = await query(
      "SELECT id FROM user_progress WHERE user_id = $1 AND clue_id = $2",
      [userId, clueId]
    );

    if (progressResult.rows.length > 0) {
      return res.status(409).json({
        error: "Already unlocked",
        message: "You have already unlocked this clue",
      });
    }

    // Check password
    if (clue.password !== password) {
      return res.status(401).json({
        error: "Invalid password",
        message: "The password you entered is incorrect",
      });
    }

    // Check lock state - if requires_previous, verify all previous clues are unlocked
    if (clue.lock_state === "requires_previous") {
      const previousCluesResult = await query(
        "SELECT c.id FROM clues c WHERE c.order_index < $1 ORDER BY c.order_index",
        [clue.order_index]
      );

      if (previousCluesResult.rows.length > 0) {
        const unlockedCluesResult = await query(
          "SELECT DISTINCT clue_id FROM user_progress WHERE user_id = $1 AND clue_id = ANY($2)",
          [userId, previousCluesResult.rows.map((row) => row.id)]
        );

        if (unlockedCluesResult.rows.length < previousCluesResult.rows.length) {
          return res.status(423).json({
            error: "Clue locked",
            message:
              "You must unlock all previous clues before unlocking this one",
          });
        }
      }
    }

    // Unlock the clue
    await query(
      "INSERT INTO user_progress (user_id, clue_id) VALUES ($1, $2)",
      [userId, clueId]
    );

    res.json({
      success: true,
      message: "Clue unlocked successfully",
      data: {
        clueId: clueId,
        unlockedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Database error",
      message: "Failed to unlock clue",
    });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to NFC Scavenger Hunt Server",
    endpoints: {
      health: "/health",
      register: "POST /api/register - Register with username",
      users: "GET /api/users/:userId - Get user info",
      clues: "GET /api/clues?userId=:userId - Get unlocked clues",
      clueDetails:
        "GET /api/clues/:clueId?userId=:userId - Get specific clue if unlocked",
      unlock: "POST /api/clues/:clueId/unlock - Unlock clue with password",
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
