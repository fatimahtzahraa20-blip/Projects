import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { safepayProof } from "@/lib/safepay";

async function complete(request: Request, values: URLSearchParams) {
  const reference = new URL(request.url).searchParams.get("reference") || "unknown";
  const tracker = values.get("tracker") || "";
  const signature = values.get("sig") || "";
  const secret = process.env.SAFEPAY_V1_SECRET;
  if (!tracker || !signature || !secret) return NextResponse.redirect(new URL(`/track/${reference}?payment=failed`, request.url), 303);
  const expected = createHmac("sha256", secret).update(tracker).digest("hex");
  const valid = expected.length === signature.length && timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  if (!valid) return NextResponse.redirect(new URL(`/track/${reference}?payment=failed`, request.url), 303);
  const proof = safepayProof(reference, tracker);
  return NextResponse.redirect(new URL(`/track/${reference}?payment=safepay_success&tracker=${encodeURIComponent(tracker)}&proof=${proof}`, request.url), 303);
}

export async function GET(request: Request) { return complete(request, new URL(request.url).searchParams); }
export async function POST(request: Request) {
  const form = await request.formData();
  const values = new URLSearchParams();
  form.forEach((value, key) => values.set(key, String(value)));
  return complete(request, values);
}
