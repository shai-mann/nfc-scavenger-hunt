import User from "../models/User";
import { CreateUserRequest } from "../types/api";
import { ConflictError, NotFoundError } from "../utils/errors";

class UserService {
  static async registerUser(userData: CreateUserRequest): Promise<User> {
    const { username } = userData;

    // Check if username already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      throw new ConflictError("This username is already registered");
    }

    // Create new user
    return await User.create(username);
  }

  static async getUserById(userId: string): Promise<User> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  static async validateUserExists(userId: string): Promise<boolean> {
    const exists = await User.exists(userId);
    if (!exists) {
      throw new NotFoundError("User not found");
    }
    return true;
  }
}

export default UserService;
