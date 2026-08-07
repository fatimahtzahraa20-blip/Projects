import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { formatGBP } from "@/lib/pricing";

const bookingEmailSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().min(1).max(100),
  reference: z.string().trim().min(1).max(40),
  service: z.string().trim().min(1).max(80),
  address: z.string().trim().min(1).max(300),
  scheduledFor: z.string().trim().min(1).max(120),
  priceLow: z.number().nonnegative(),
  priceHigh: z.number().nonnegative(),
});

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const configuredFrom = process.env.EMAIL_FROM?.trim();
  const testMode = !configuredFrom || /@(resend\.dev|example\.com)>?$/i.test(configuredFrom);
  const from = testMode ? "TradeWeb <onboarding@resend.dev>" : configuredFrom;

  if (!apiKey) {
    return NextResponse.json({ error: "Resend is not configured." }, { status: 503 });
  }

  const parsed = bookingEmailSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid booking email details." }, { status: 400 });
  }

  const booking = parsed.data;
  const recipient = testMode ? (process.env.RESEND_TEST_EMAIL || "delivered@resend.dev") : booking.email;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const trackingUrl = `${appUrl.replace(/\/$/, "")}/track/${encodeURIComponent(booking.reference)}`;
  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    to: [recipient],
    subject: `Booking confirmed - ${booking.reference}`,
    text: [
      `Hello ${booking.name},`,
      "",
      `Your ${booking.service} booking is confirmed.`,
      `Reference: ${booking.reference}`,
      `Address: ${booking.address}`,
      `Schedule: ${booking.scheduledFor}`,
      `Estimated price: ${formatGBP(booking.priceLow)} - ${formatGBP(booking.priceHigh)}`,
      `Track your booking: ${trackingUrl}`,
      "",
      "TradeWeb",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#18181b">
        <h1 style="font-size:24px">Booking confirmed</h1>
        <p>Hello ${escapeHtml(booking.name)},</p>
        <p>Your <strong>${escapeHtml(booking.service)}</strong> booking has been received.</p>
        <div style="background:#f4f4f5;border-radius:10px;padding:16px;margin:20px 0">
          <p><strong>Reference:</strong> ${escapeHtml(booking.reference)}</p>
          <p><strong>Address:</strong> ${escapeHtml(booking.address)}</p>
          <p><strong>Schedule:</strong> ${escapeHtml(booking.scheduledFor)}</p>
          <p><strong>Estimated price:</strong> ${formatGBP(booking.priceLow)} - ${formatGBP(booking.priceHigh)}</p>
        </div>
        <a href="${escapeHtml(trackingUrl)}" style="display:inline-block;background:#2563eb;color:white;text-decoration:none;padding:12px 18px;border-radius:8px">Track booking</a>
        <p style="margin-top:28px;color:#71717a;font-size:13px">TradeWeb - Trusted services, dispatched in minutes.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend booking confirmation failed", error);
    return NextResponse.json({ error: "Email could not be sent." }, { status: 502 });
  }

  return NextResponse.json({ sent: true, id: data?.id, testMode });
}
