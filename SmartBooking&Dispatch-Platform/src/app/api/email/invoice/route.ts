import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { formatGBP } from "@/lib/pricing";

const invoiceSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120),
  reference: z.string().min(1).max(40),
  invoiceNumber: z.string().min(1).max(40),
  dueAt: z.string().datetime(),
  total: z.number().nonnegative(),
});

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Email is not configured." }, { status: 503 });
  const parsed = invoiceSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid invoice details." }, { status: 400 });

  const configuredFrom = process.env.EMAIL_FROM?.trim();
  const testMode = !configuredFrom || /@(resend\.dev|example\.com)>?$/i.test(configuredFrom);
  const from = testMode ? "TradeWeb <onboarding@resend.dev>" : configuredFrom;
  const recipient = testMode ? (process.env.RESEND_TEST_EMAIL || "delivered@resend.dev") : parsed.data.email;
  const due = new Date(parsed.data.dueAt).toLocaleDateString("en-GB", { dateStyle: "long" });
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: recipient,
    subject: `Invoice ${parsed.data.invoiceNumber} — pay later confirmed`,
    text: `Hello ${parsed.data.name}, pay later is confirmed for ${parsed.data.reference}. ${formatGBP(parsed.data.total)} is due by ${due}.`,
    html: `<p>Hello ${parsed.data.name},</p><p>Pay later is confirmed for booking <strong>${parsed.data.reference}</strong>.</p><p>Invoice <strong>${parsed.data.invoiceNumber}</strong>: ${formatGBP(parsed.data.total)}, due ${due}.</p>`,
  });
  if (error) return NextResponse.json({ error: "Invoice email could not be sent." }, { status: 502 });
  return NextResponse.json({ sent: true, testMode });
}
