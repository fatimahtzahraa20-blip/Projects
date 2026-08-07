import { NextResponse } from "next/server";
import { z } from "zod";
import { validSafepayProof } from "@/lib/safepay";

const schema = z.object({ reference: z.string().min(1).max(60), tracker: z.string().min(1).max(160), proof: z.string().length(64) });
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  const verified = parsed.success && validSafepayProof(parsed.data.reference, parsed.data.tracker, parsed.data.proof);
  return NextResponse.json({ verified }, { status: verified ? 200 : 400 });
}
