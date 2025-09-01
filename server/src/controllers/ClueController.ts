import { NextFunction, Request, Response } from "express";
import ClueService from "../services/ClueService";
import {
  ClueParams,
  CompleteClueRequest,
  VerifyCluePasswordRequest,
} from "../types/api";

class ClueController {
  static async getClue(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id: clueId }: ClueParams = req.params as ClueParams;
      const clue = await ClueService.getClue(clueId, req.userId!);

      res.json({
        success: true,
        data: clue,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserClues(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const clues = await ClueService.getUserClues(req.userId!);

      res.json({
        success: true,
        data: clues.map((clue) => ({
          id: clue.id,
          title: clue.title,
          order_index: clue.order_index,
          unlocked_at: clue.unlocked_at,
        })),
      });
    } catch (error) {
      next(error);
    }
  }

  static async unlockClue(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id: clueId }: ClueParams = req.params as ClueParams;
      const unlockData: CompleteClueRequest = {
        ...req.body,
        user_id: req.userId!,
      };

      const result = await ClueService.unlockClue(clueId, unlockData);

      res.json({
        success: true,
        message: "Clue unlocked successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id: clueId }: ClueParams = req.params as ClueParams;
      const passwordData: VerifyCluePasswordRequest = req.body;

      const result = await ClueService.verifyCluePassword(clueId, passwordData);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ClueController;
