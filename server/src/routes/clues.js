const express = require('express');
const ClueController = require('../controllers/ClueController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// All clue routes require authentication
router.use(requireAuth);

// Get user's unlocked clues
router.get('/', ClueController.getUserClues);

// Get specific clue (requires unlock verification)
router.get('/:clueId', ClueController.getClue);

// Unlock a clue
router.post('/:clueId/unlock', ClueController.unlockClue);

module.exports = router;