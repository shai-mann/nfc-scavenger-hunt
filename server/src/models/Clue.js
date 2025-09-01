import { query } from "../db";

class Clue {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.data = data.data;
    this.password = data.password;
    this.lock_state = data.lock_state;
    this.order_index = data.order_index;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findById(id) {
    const result = await query("SELECT * FROM clues WHERE id = $1", [id]);
    return result.rows.length > 0 ? new Clue(result.rows[0]) : null;
  }

  static async findAll(orderBy = "order_index") {
    const result = await query(`SELECT * FROM clues ORDER BY ${orderBy}`);
    return result.rows.map((row) => new Clue(row));
  }

  static async findByOrderIndex(orderIndex) {
    const result = await query("SELECT * FROM clues WHERE order_index = $1", [
      orderIndex,
    ]);
    return result.rows.length > 0 ? new Clue(result.rows[0]) : null;
  }

  static async findPreviousClues(orderIndex) {
    const result = await query(
      "SELECT * FROM clues WHERE order_index < $1 ORDER BY order_index",
      [orderIndex]
    );
    return result.rows.map((row) => new Clue(row));
  }

  async verifyPassword(password) {
    return this.password === password;
  }

  toPublicJSON() {
    return {
      id: this.id,
      title: this.title,
      data: this.data,
      order_index: this.order_index,
    };
  }
}

export default Clue;
