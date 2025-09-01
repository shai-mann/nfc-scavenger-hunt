import { Request, Response, NextFunction } from 'express';
import UserService from '../services/UserService';
import { CreateUserRequest } from '../types/api';

class UserController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: CreateUserRequest = req.body;
      const user = await UserService.registerUser(userData);
      
      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          created_at: user.created_at
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.getUserById(req.userId!);
      
      res.json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          created_at: user.created_at
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;