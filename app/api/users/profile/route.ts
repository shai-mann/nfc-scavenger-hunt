import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../server/lib/supabase";

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

    // Get user profile
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return NextResponse.json({
        success: false,
        error: "User not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        username: user.name,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}