export type LockState = "none" | "requires_previous";

export interface UserRow {
  id: string;
  username: string;
  created_at: Date;
  updated_at: Date;
}

export interface ClueRow {
  id: string;
  title: string;
  data: any; // JSONB field
  password: string;
  lock_state: LockState;
  created_at: Date;
  updated_at: Date;
  order_index: number;
}

export interface UserProgressRow {
  id: number;
  user_id: string;
  clue_id: string;
  completed_at: Date;
}

export interface CluePublic {
  id: string;
  title: string;
  data: any;
  order_index: number;
}

export interface DatabaseQueryResult<T = any> {
  rows: T[];
  rowCount: number | null;
  command: string;
}
