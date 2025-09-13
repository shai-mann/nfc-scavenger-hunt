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
  bits_name: string;
  data: {
    text?: string;
    isCopyable?: boolean;
    image?: string; // path to the image
  };
  order_index: number;
  unlocked_at?: string;
}

export interface ClueMetadata {
  id: string;
  title: string;
  order_index: number;
  unlocked_at?: string;
}

export type HealthCheckResponse = {
  message: string;
  timestamp: string;
};

export interface CreateUserRequest {
  username: string;
}
