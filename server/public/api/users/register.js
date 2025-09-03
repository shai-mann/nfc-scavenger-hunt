"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const zod_1 = require("zod");
const supabase_1 = require("../../lib/supabase");
const types_1 = require("../../lib/types");
async function handler(req, res) {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed",
        });
    }
    try {
        const validatedData = types_1.CreateUserSchema.parse(req.body);
        const { username } = validatedData;
        // Check if username already exists
        const { data: existingUser, error: existingUserError } = await supabase_1.supabase
            .from("users")
            .select("id")
            .eq("name", username)
            .single();
        if (existingUserError && existingUserError.code !== "PGRST116") {
            throw new Error("Database query failed");
        }
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: "This username is already registered",
            });
        }
        // Create new user
        const { data: newUser, error: createError } = await supabase_1.supabase
            .from("users")
            .insert([
            {
                name: username,
                email: `${username}@temp.com`, // Placeholder since we don't collect email
            },
        ])
            .select()
            .single();
        if (createError) {
            throw new Error("Failed to create user");
        }
        return res.status(201).json({
            success: true,
            data: {
                id: newUser.id,
                username: newUser.name,
                created_at: newUser.created_at,
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({
                success: false,
                error: "Validation failed",
                details: error.issues,
            });
        }
        console.error("User registration error:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
}
