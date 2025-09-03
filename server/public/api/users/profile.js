"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const supabase_1 = require("../../lib/supabase");
async function handler(req, res) {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    if (req.method !== "GET") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed",
        });
    }
    try {
        // Simple auth check - get userId from headers or query params
        const userId = req.headers["x-user-id"] || req.query.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: "User ID required",
            });
        }
        // Get user profile
        const { data: user, error } = await supabase_1.supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();
        if (error || !user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: {
                id: user.id,
                username: user.name,
                created_at: user.created_at,
            },
        });
    }
    catch (error) {
        console.error("Get profile error:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
}
