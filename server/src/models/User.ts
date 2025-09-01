import { query } from "../db";
import { UserRow } from "../types/database";

class User {
  public id: string;
  public username: string;
  public created_at: Date;
  public updated_at: Date;

  constructor(data: UserRow) {
    this.id = data.id;
    this.username = data.username;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findById(id: string): Promise<User | null> {
    const result = await query<UserRow>("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    return result.rows.length > 0 ? new User(result.rows[0]!) : null;
  }

  static async findByUsername(username: string): Promise<User | null> {
    const result = await query<UserRow>(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    return result.rows.length > 0 ? new User(result.rows[0]!) : null;
  }

  static async create(username: string): Promise<User> {
    const result = await query<UserRow>(
      "INSERT INTO users (username) VALUES ($1) RETURNING *",
      [username]
    );
    return new User(result.rows[0]!);
  }

  static async exists(id: string): Promise<boolean> {
    return (await this.findById(id)) !== null;
  }
}

export default User;
