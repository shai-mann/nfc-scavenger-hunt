import { query } from '../db';
import { ClueRow, CluePublic, LockState } from '../types/database';

export class Clue {
  public id: string;
  public title: string;
  public data: any;
  public password: string;
  public lock_state: LockState;
  public order_index: number;
  public created_at: Date;
  public updated_at: Date;

  constructor(data: ClueRow) {
    this.id = data.id;
    this.title = data.title;
    this.data = data.data;
    this.password = data.password;
    this.lock_state = data.lock_state;
    this.order_index = data.order_index;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findById(id: string): Promise<Clue | null> {
    const result = await query<ClueRow>('SELECT * FROM clues WHERE id = $1', [id]);
    return result.rows.length > 0 ? new Clue(result.rows[0]!) : null;
  }

  static async findAll(orderBy: string = 'order_index'): Promise<Clue[]> {
    const result = await query<ClueRow>(`SELECT * FROM clues ORDER BY ${orderBy}`);
    return result.rows.map((row) => new Clue(row));
  }

  static async findByOrderIndex(orderIndex: number): Promise<Clue | null> {
    const result = await query<ClueRow>('SELECT * FROM clues WHERE order_index = $1', [
      orderIndex,
    ]);
    return result.rows.length > 0 ? new Clue(result.rows[0]!) : null;
  }

  static async findPreviousClues(orderIndex: number): Promise<Clue[]> {
    const result = await query<ClueRow>(
      'SELECT * FROM clues WHERE order_index < $1 ORDER BY order_index',
      [orderIndex]
    );
    return result.rows.map((row) => new Clue(row));
  }

  async verifyPassword(password: string): Promise<boolean> {
    return this.password === password;
  }

  toPublicJSON(): CluePublic {
    return {
      id: this.id,
      title: this.title,
      data: this.data,
      order_index: this.order_index,
    };
  }
}

export default Clue;