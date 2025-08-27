const express = require("express");
const cors = require("cors");
require("dotenv").config();

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

// Sample clue endpoint
app.get("/api/clues/:clueId", (req, res) => {
  const { clueId } = req.params;

  // Mock data - in a real app, this would come from a database
  const mockClues = {
    "clue-1": {
      id: "clue-1",
      title: "The Hidden Library",
      text: "Find the ancient tome hidden behind the third pillar from the entrance. The answer lies within its weathered pages.",
      isCopyable: true,
      image: null,
      location: "Main Library",
      points: 100,
    },
    "clue-2": {
      id: "clue-2",
      title: "Secret Garden Path",
      text: "Follow the stone path that winds through the rose garden. Count the steps and remember the number.",
      isCopyable: false,
      image: null,
      location: "Botanical Gardens",
      points: 150,
    },
    "clue-3": {
      id: "clue-3",
      title: "The Clock Tower Mystery",
      text: "At exactly 3:15 PM, the shadow of the clock tower points to a hidden marker. What do you see?",
      isCopyable: true,
      image: "https://example.com/clock-tower.jpg",
      location: "Clock Tower Plaza",
      points: 200,
    },
  };

  const clue = mockClues[clueId];

  if (!clue) {
    return res.status(404).json({
      error: "Clue not found",
      message: `No clue found with ID: ${clueId}`,
    });
  }

  res.json({
    success: true,
    data: clue,
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to NFC Scavenger Hunt Server",
    endpoints: {
      health: "/health",
      clues: "/api/clues/:clueId",
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
app.listen(PORT, () => {
  console.log(`🚀 NFC Scavenger Hunt Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Sample clue: http://localhost:${PORT}/api/clues/clue-1`);
});
