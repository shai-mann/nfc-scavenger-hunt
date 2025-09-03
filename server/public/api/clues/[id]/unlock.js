"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const zod_1 = require("zod");
const supabase_1 = require("../../../lib/supabase");
const types_1 = require("../../../lib/types");
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
        // Validate clue ID
        const validatedParams = types_1.ClueParamsSchema.parse({ id: req.query.id });
        const { id: clueId } = validatedParams;
        // Validate request body
        const validatedBody = types_1.CompleteClueSchema.parse(req.body);
        const { userId, password } = validatedBody;
        // Get the clue to verify password
        const { data: clue, error: clueError } = await supabase_1.supabase
            .from("clues")
            .select("*")
            .eq("id", clueId)
            .single();
        if (clueError || !clue) {
            return res.status(404).json({
                success: false,
                error: "Clue not found",
            });
        }
        // Simple password verification (in real app, this would be hashed)
        // For now, we'll use the NFC tag ID as the password
        if (password !== clue.nfc_tag_id) {
            return res.status(400).json({
                success: false,
                error: "Incorrect password",
            });
        }
        // Check if already unlocked
        const { data: existingProgress, error: progressError } = await supabase_1.supabase
            .from("user_progress")
            .select("*")
            .eq("user_id", userId)
            .eq("clue_id", clueId)
            .single();
        if (existingProgress && !progressError) {
            return res.status(400).json({
                success: false,
                error: "Clue already unlocked",
            });
        }
        // Create progress entry
        const { data: newProgress, error: insertError } = await supabase_1.supabase
            .from("user_progress")
            .insert([
            {
                user_id: userId,
                clue_id: clueId,
                unlocked_at: new Date().toISOString(),
            },
        ])
            .select()
            .single();
        if (insertError) {
            throw new Error("Failed to unlock clue");
        }
        return res.status(201).json({
            success: true,
            message: "Clue unlocked successfully",
            data: {
                id: newProgress.id,
                user_id: newProgress.user_id,
                clue_id: newProgress.clue_id,
                unlocked_at: newProgress.unlocked_at,
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
        console.error("Unlock clue error:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
}
