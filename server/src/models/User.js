import { query } from "../db";

class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findById(id) {
    const result = await query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  static async findByUsername(username) {
    const result = await query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  static async create(username) {
    const result = await query(
      "INSERT INTO users (username) VALUES ($1) RETURNING *",
      [username]
    );
    return new User(result.rows[0]);
  }

  static async exists(id) {
    return (await this.findById(id)) !== null;
  }
}

export default User;
