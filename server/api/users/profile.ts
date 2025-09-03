import { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../../lib/supabase";

export = async function handler(req: VercelRequest, res: VercelResponse) {
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
    const userId =
      (req.headers["x-user-id"] as string) || (req.query.userId as string);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User ID required",
      });
    }

    // Get user profile
    const { data: user, error } = await supabase
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
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
