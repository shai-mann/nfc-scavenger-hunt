import { VercelRequest, VercelResponse } from "@vercel/node";
import { ZodError } from "zod";
import { supabase } from "../../lib/supabase";
import { CreateUserSchema } from "../../lib/types";

export = async function handler(req: VercelRequest, res: VercelResponse) {
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
    const validatedData = CreateUserSchema.parse(req.body);
    const { username } = validatedData;

    // Check if username already exists
    const { data: existingUser, error: existingUserError } = await supabase
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
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert([
        {
          name: username,
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
  } catch (error) {
    if (error instanceof ZodError) {
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
};
