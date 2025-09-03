import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { supabase } from "../../../../../server/lib/supabase";
import { ClueParamsSchema, CompleteClueSchema } from "../../../../../server/lib/types";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate clue ID
    const validatedParams = ClueParamsSchema.parse({ id: params.id });
    const { id: clueId } = validatedParams;

    // Validate request body
    const body = await request.json();
    const validatedBody = CompleteClueSchema.parse(body);
    const { userId, password } = validatedBody;

    // Get the clue to verify password
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

    // Simple password verification (in real app, this would be hashed)
    // For now, we'll use the NFC tag ID as the password
    if (password !== clue.nfc_tag_id) {
      return NextResponse.json({
        success: false,
        error: "Incorrect password",
      }, { status: 400 });
    }

    // Check if already unlocked
    const { data: existingProgress, error: progressError } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("clue_id", clueId)
      .single();

    if (existingProgress && !progressError) {
      return NextResponse.json({
        success: false,
        error: "Clue already unlocked",
      }, { status: 400 });
    }

    // Create progress entry
    const { data: newProgress, error: insertError } = await supabase
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

    return NextResponse.json({
      success: true,
      message: "Clue unlocked successfully",
      data: {
        id: newProgress.id,
        user_id: newProgress.user_id,
        clue_id: newProgress.clue_id,
        unlocked_at: newProgress.unlocked_at,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        success: false,
        error: "Validation failed",
        details: error.issues,
      }, { status: 400 });
    }

    console.error("Unlock clue error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}