import User from "../models/User";
import { ConflictError, NotFoundError, ValidationError } from "../utils/errors";

class UserService {
  static async registerUser(username) {
    // Validate input
    if (!username) {
      throw new ValidationError("Username is required");
    }

    if (username.length < 3 || username.length > 50) {
      throw new ValidationError("Username must be between 3 and 50 characters");
    }

    // Check if username already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      throw new ConflictError("This username is already registered");
    }

    // Create new user
    return await User.create(username);
  }

  static async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  static async validateUserExists(userId) {
    const exists = await User.exists(userId);
    if (!exists) {
      throw new NotFoundError("User not found");
    }
    return true;
  }
}

export default UserService;
