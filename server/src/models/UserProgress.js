import { query } from "../db";

class UserProgress {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.clue_id = data.clue_id;
    this.completed_at = data.completed_at;
  }

  static async findByUserAndClue(userId, clueId) {
    const result = await query(
      "SELECT * FROM user_progress WHERE user_id = $1 AND clue_id = $2",
      [userId, clueId]
    );
    return result.rows.length > 0 ? new UserProgress(result.rows[0]) : null;
  }

  static async findByUser(userId) {
    const result = await query(
      "SELECT * FROM user_progress WHERE user_id = $1 ORDER BY completed_at",
      [userId]
    );
    return result.rows.map((row) => new UserProgress(row));
  }

  static async getUserUnlockedClues(userId) {
    const result = await query(
      `SELECT c.*, up.completed_at as unlocked_at
       FROM clues c
       INNER JOIN user_progress up ON c.id = up.clue_id
       WHERE up.user_id = $1
       ORDER BY c.order_index`,
      [userId]
    );
    return result.rows;
  }

  static async hasUserUnlockedClue(userId, clueId) {
    return (await this.findByUserAndClue(userId, clueId)) !== null;
  }

  static async hasUserUnlockedAllClues(userId, clueIds) {
    const result = await query(
      "SELECT COUNT(DISTINCT clue_id) as count FROM user_progress WHERE user_id = $1 AND clue_id = ANY($2)",
      [userId, clueIds]
    );
    return parseInt(result.rows[0].count) === clueIds.length;
  }

  static async create(userId, clueId) {
    const result = await query(
      "INSERT INTO user_progress (user_id, clue_id) VALUES ($1, $2) RETURNING *",
      [userId, clueId]
    );
    return new UserProgress(result.rows[0]);
  }
}

export default UserProgress;
