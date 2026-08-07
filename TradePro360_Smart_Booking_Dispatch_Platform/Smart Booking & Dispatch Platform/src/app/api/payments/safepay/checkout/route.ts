import { NextResponse } from "next/server";
import { z } from "zod";
import { getSandboxSafepay } from "@/lib/safepay";

const schema = z.object({
  amount: z.number().positive().max(1_000_000),
  invoiceNumber: z.string().regex(/^[A-Za-z0-9-]+$/).max(60),
  reference: z.string().regex(/^[A-Za-z0-9-]+$/).max(60),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid sandbox payment details." }, { status: 400 });
  try {
    const safepay = getSandboxSafepay();
    if (!safepay) return NextResponse.json({ error: "Safepay keys are missing from the active project .env file." }, { status: 503 });
    const { amount, invoiceNumber, reference } = parsed.data;
    const { token } = await safepay.payments.create({ amount: Math.round(amount * 100), currency: "GBP" });
    const origin = new URL(request.url).origin;
    const url = safepay.checkout.create({
      token,
      orderId: invoiceNumber,
      cancelUrl: `${origin}/track/${encodeURIComponent(reference)}?payment=cancelled`,
      redirectUrl: `${origin}/api/payments/safepay/callback?reference=${encodeURIComponent(reference)}`,
      source: "custom",
      webhooks: false,
    });
    return NextResponse.json({ url, sandbox: true });
  } catch (error) {
    console.error("Safepay sandbox checkout failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Safepay rejected the sandbox credentials or request." }, { status: 502 });
  }
}
