import Clue from "../models/Clue";
import UserProgress from "../models/UserProgress";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../utils/errors";
import UserService from "./UserService";

class ClueService {
  static async getClue(clueId, userId) {
    // Validate user exists
    await UserService.validateUserExists(userId);

    // Check if clue exists
    const clue = await Clue.findById(clueId);
    if (!clue) {
      throw new NotFoundError(`No clue found with ID: ${clueId}`);
    }

    // Check if user has unlocked this clue
    const progress = await UserProgress.findByUserAndClue(userId, clueId);
    if (!progress) {
      throw new ForbiddenError("You must unlock this clue to view it");
    }

    return {
      ...clue.toPublicJSON(),
      unlockedAt: progress.completed_at,
    };
  }

  static async getUserClues(userId) {
    // Validate user exists
    await UserService.validateUserExists(userId);

    // Get all clues the user has unlocked
    return await UserProgress.getUserUnlockedClues(userId);
  }

  static async unlockClue(clueId, userId, password) {
    // Validate input
    if (!password) {
      throw new ValidationError("Password is required");
    }

    // Validate user exists
    await UserService.validateUserExists(userId);

    // Check if clue exists
    const clue = await Clue.findById(clueId);
    if (!clue) {
      throw new NotFoundError(`No clue found with ID: ${clueId}`);
    }

    // Check if user already unlocked this clue
    const existingProgress = await UserProgress.hasUserUnlockedClue(
      userId,
      clueId
    );
    if (existingProgress) {
      throw new ConflictError("You have already unlocked this clue");
    }

    // Verify password
    if (!clue.verifyPassword(password)) {
      throw new UnauthorizedError("The password you entered is incorrect");
    }

    // Check lock state - if requires_previous, verify all previous clues are unlocked
    if (clue.lock_state === "requires_previous") {
      const previousClues = await Clue.findPreviousClues(clue.order_index);

      if (previousClues.length > 0) {
        const previousClueIds = previousClues.map((c) => c.id);
        const hasUnlockedAll = await UserProgress.hasUserUnlockedAllClues(
          userId,
          previousClueIds
        );

        if (!hasUnlockedAll) {
          throw new ForbiddenError(
            "You must unlock all previous clues before unlocking this one"
          );
        }
      }
    }

    // Unlock the clue
    const progress = await UserProgress.create(userId, clueId);

    return {
      clueId: clueId,
      unlockedAt: progress.completed_at,
    };
  }
}

export default ClueService;
