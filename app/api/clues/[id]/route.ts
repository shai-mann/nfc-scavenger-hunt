import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { supabase } from "../../../../server/lib/supabase";
import { ClueParamsSchema } from "../../../../server/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Simple auth check - get userId from headers or query params
    const userId = request.headers.get("x-user-id") || request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "User ID required",
      }, { status: 401 });
    }

    // Validate clue ID
    const validatedParams = ClueParamsSchema.parse({ id: params.id });
    const { id: clueId } = validatedParams;

    // Check if user has unlocked this clue
    const { data: userProgress, error: progressError } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("clue_id", clueId)
      .single();

    if (progressError || !userProgress) {
      return NextResponse.json({
        success: false,
        error: "Clue not unlocked for this user",
      }, { status: 403 });
    }

    // Get the clue details
    const { data: clue, error: clueError } = await supabase
      .from("clues")
      .select("*")
      .eq("id", clueId)
      .single();

    if (clueError || !clue) {
      return NextResponse.json({
        success: false,
        error: "Clue not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: clue,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        success: false,
        error: "Invalid clue ID format",
      }, { status: 400 });
    }

    console.error("Get clue error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}