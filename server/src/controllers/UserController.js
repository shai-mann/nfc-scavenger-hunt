const UserService = require('../services/UserService');

class UserController {
  static async register(req, res, next) {
    try {
      const { username } = req.body;
      const user = await UserService.registerUser(username);
      
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

  static async getProfile(req, res, next) {
    try {
      const user = await UserService.getUserById(req.userId);
      
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

module.exports = UserController;