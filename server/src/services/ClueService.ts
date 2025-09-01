import Clue from "../models/Clue";
import UserProgress from "../models/UserProgress";
import { CompleteClueRequest, VerifyCluePasswordRequest } from "../types/api";
import { CluePublic } from "../types/database";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors";
import UserService from "./UserService";

interface ClueWithUnlockedAt extends CluePublic {
  unlockedAt: Date;
}

interface UnlockResult {
  clueId: string;
  unlockedAt: Date;
}

class ClueService {
  static async getClue(
    clueId: string,
    userId: string
  ): Promise<ClueWithUnlockedAt> {
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

  static async getUserClues(userId: string) {
    // Validate user exists
    await UserService.validateUserExists(userId);

    // Get all clues the user has unlocked
    const unlockedClues = await UserProgress.getUserUnlockedClues(userId);

    // Get all clues
    const allClues = await Clue.findAll();

    return allClues.map((clue) => ({
      id: clue.id,
      title: clue.title,
      order_index: clue.order_index,
      status: unlockedClues.some((c) => c.id === clue.id)
        ? "unlocked"
        : "locked",
      unlocked_at:
        unlockedClues.find((c) => c.id === clue.id)?.unlocked_at ?? null,
    }));
  }

  static async unlockClue(
    clueId: string,
    unlockData: CompleteClueRequest
  ): Promise<UnlockResult> {
    const { userId, password } = unlockData;

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
    if (!(await clue.verifyPassword(password))) {
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

  static async verifyCluePassword(
    clueId: string,
    passwordData: VerifyCluePasswordRequest
  ): Promise<{ valid: boolean }> {
    const { password } = passwordData;

    // Check if clue exists
    const clue = await Clue.findById(clueId);
    if (!clue) {
      throw new NotFoundError(`No clue found with ID: ${clueId}`);
    }

    // Verify password
    const isValid = await clue.verifyPassword(password);

    return { valid: isValid };
  }
}

export default ClueService;
