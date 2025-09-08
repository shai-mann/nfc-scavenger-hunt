import { VercelRequest, VercelResponse } from "@vercel/node";
import { createSuccessResponse, withMethodRestriction } from "../lib/api";

async function healthHandler(req: VercelRequest, res: VercelResponse) {
  createSuccessResponse(res, {
    message: "NFC Scavenger Hunt API is running on Vercel",
    timestamp: new Date().toISOString(),
  });
}

export default withMethodRestriction(["GET"], healthHandler);
