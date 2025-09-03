"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProgressParamsSchema = exports.CompleteClueSchema = exports.VerifyCluePasswordSchema = exports.ClueParamsSchema = exports.UserParamsSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
// User schemas
exports.CreateUserSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(1, "Username is required")
        .max(50, "Username must be 50 characters or less")
        .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores"),
});
exports.UserParamsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Invalid user ID format"),
});
// Clue schemas
exports.ClueParamsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Invalid clue ID format"),
});
exports.VerifyCluePasswordSchema = zod_1.z.object({
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.CompleteClueSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid("Invalid user ID format"),
    password: zod_1.z.string().min(1, "Password is required"),
});
// Progress schemas
exports.UserProgressParamsSchema = zod_1.z.object({
    user_id: zod_1.z.string().uuid("Invalid user ID format"),
});
