import { Router } from "express";
import UserController from "../controllers/UserController";
import { requireAuth } from "../middleware/auth";
import { validateRequest } from "../middleware/validation";
import { CreateUserSchema } from "../types/api";

const router = Router();

// User registration endpoint (no auth required)
router.post(
  "/register",
  validateRequest(CreateUserSchema, "body"),
  UserController.register
);

// Get user profile (auth required)
router.get("/profile", requireAuth, UserController.getProfile);

export default router;
