import { VercelRequest, VercelResponse } from "@vercel/node";

export async function GET(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    status: "OK",
    message: "NFC Scavenger Hunt API is running on Vercel",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
  });
}
