const ClueService = require('../services/ClueService');

class ClueController {
  static async getClue(req, res, next) {
    try {
      const { clueId } = req.params;
      const clue = await ClueService.getClue(clueId, req.userId);
      
      res.json({
        success: true,
        data: clue
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserClues(req, res, next) {
    try {
      const clues = await ClueService.getUserClues(req.userId);
      
      res.json({
        success: true,
        data: clues.map(clue => ({
          id: clue.id,
          title: clue.title,
          order_index: clue.order_index,
          unlocked_at: clue.unlocked_at
        }))
      });
    } catch (error) {
      next(error);
    }
  }

  static async unlockClue(req, res, next) {
    try {
      const { clueId } = req.params;
      const { password } = req.body;
      const result = await ClueService.unlockClue(clueId, req.userId, password);
      
      res.json({
        success: true,
        message: 'Clue unlocked successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ClueController;