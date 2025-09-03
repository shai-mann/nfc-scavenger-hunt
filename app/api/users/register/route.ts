import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { supabase } from "../../../../server/lib/supabase";
import { CreateUserSchema } from "../../../../server/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateUserSchema.parse(body);
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
      return NextResponse.json({
        success: false,
        error: "This username is already registered",
      }, { status: 409 });
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

    return NextResponse.json({
      success: true,
      data: {
        id: newUser.id,
        username: newUser.name,
        created_at: newUser.created_at,
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

    console.error("User registration error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}