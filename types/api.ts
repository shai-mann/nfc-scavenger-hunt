export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

export interface User {
  id: string;
  username: string;
  created_at: string;
}

export interface Clue {
  id: string;
  title: string;
  description: string;
  order_index: number;
  unlocked_at?: string;
}

export interface CreateUserRequest {
  username: string;
}
