import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../server/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Simple auth check - get userId from headers or query params
    const userId = request.headers.get("x-user-id") || request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "User ID required",
      }, { status: 401 });
    }

    // Get user's unlocked clues
    const { data: userProgress, error: progressError } = await supabase
      .from("user_progress")
      .select(
        `
        clue_id,
        unlocked_at,
        clues (
          id,
          title,
          order_index
        )
      `
      )
      .eq("user_id", userId);

    if (progressError) {
      throw new Error("Failed to fetch user progress");
    }

    const clues = (userProgress || []).map((progress) => ({
      id: progress.clues.id,
      title: progress.clues.title,
      order_index: progress.clues.order_index,
      unlocked_at: progress.unlocked_at,
    }));

    return NextResponse.json({
      success: true,
      data: clues,
    });
  } catch (error) {
    console.error("Get user clues error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}