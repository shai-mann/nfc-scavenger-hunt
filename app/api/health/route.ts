import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "OK",
    message: "NFC Scavenger Hunt API is running on Vercel",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}