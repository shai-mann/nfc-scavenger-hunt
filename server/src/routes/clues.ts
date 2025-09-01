import { Router } from 'express';
import ClueController from '../controllers/ClueController';
import { requireAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { 
  ClueParamsSchema, 
  CompleteClueSchema, 
  VerifyCluePasswordSchema,
  UserProgressParamsSchema 
} from '../types/api';

const router = Router();

// All clue routes require authentication
router.use(requireAuth);

// Get user's unlocked clues
router.get('/', ClueController.getUserClues);

// Get specific clue (requires unlock verification)
router.get('/:id', 
  validateRequest(ClueParamsSchema, 'params'),
  ClueController.getClue
);

// Unlock a clue
router.post('/:id/unlock', 
  validateRequest(ClueParamsSchema, 'params'),
  validateRequest(CompleteClueSchema, 'body'),
  ClueController.unlockClue
);

// Verify clue password (without unlocking)
router.post('/:id/verify', 
  validateRequest(ClueParamsSchema, 'params'),
  validateRequest(VerifyCluePasswordSchema, 'body'),
  ClueController.verifyPassword
);

export default router;