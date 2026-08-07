"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CreditCard, Download, CalendarClock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatGBP } from "@/lib/pricing";
import { downloadInvoicePdf } from "@/lib/invoice-pdf";
import { useAppStore } from "@/store/app-store";
import type { Invoice, Job } from "@/types/domain";

export function InvoicePanel({ job, invoice }: { job: Job; invoice: Invoice }) {
  const brand = useAppStore((s) => s.brand);
  const markInvoicePayLater = useAppStore((s) => s.markInvoicePayLater);
  const markInvoicePaid = useAppStore((s) => s.markInvoicePaid);
  const searchParams = useSearchParams();
  const [paying, setPaying] = useState<"card" | "pay_later" | null>(null);
  const [downloading, setDownloading] = useState(false);

  const subtotal = invoice.lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);
  const vat = subtotal * invoice.vatRate;
  const total = subtotal + vat;

  useEffect(() => {
    if (searchParams.get("payment") !== "safepay_success" || invoice.status === "paid") return;
    const tracker = searchParams.get("tracker");
    const proof = searchParams.get("proof");
    if (!tracker || !proof) return;
    void fetch("/api/payments/safepay/confirm", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: job.reference, tracker, proof }),
    }).then((response) => {
      if (!response.ok) throw new Error();
      markInvoicePaid(invoice.id, "card");
      toast.success("Sandbox payment verified", { description: `${formatGBP(total)} paid through Safepay test mode.` });
    }).catch(() => toast.error("Safepay payment could not be verified."));
  }, [invoice.id, invoice.status, job.reference, markInvoicePaid, searchParams, total]);

  async function handleDownload() {
    setDownloading(true);
    try {
      await downloadInvoicePdf(job, invoice, brand);
    } finally {
      setDownloading(false);
    }
  }

  async function handlePay(method: "card" | "pay_later") {
    setPaying(method);
    if (method === "card") {
      try {
        const response = await fetch("/api/payments/safepay/checkout", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total, invoiceNumber: invoice.number, reference: job.reference }),
        });
        const responseText = await response.text();
        let result: { url?: string; error?: string } = {};
        try {
          result = responseText ? JSON.parse(responseText) as typeof result : {};
        } catch {
          result = { error: `Checkout server returned HTTP ${response.status}.` };
        }
        if (!response.ok || !result.url) throw new Error(result.error || "Checkout could not be created.");
        window.location.assign(result.url);
        return;
      } catch (error) {
        toast.error("Safepay checkout unavailable", { description: error instanceof Error ? error.message : "Try again." });
        setPaying(null);
        return;
      }
    }
    setTimeout(() => {
        markInvoicePayLater(invoice.id);
        if (job.customerEmail) {
          void fetch("/api/email/invoice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: job.customerEmail,
              name: job.customerName,
              reference: job.reference,
              invoiceNumber: invoice.number,
              dueAt: invoice.dueAt,
              total,
            }),
          });
        }
        toast.info("Pay later selected", { description: "Invoice remains open and the customer has been notified." });
      setPaying(null);
    }, 1200);
  }

  return (
    <div className="docket p-5">
      <div className="flex items-center justify-between">
        <div>
          <span className="eyebrow text-[11px] text-muted-foreground">Invoice</span>
          <div className="ref-code text-sm font-medium">{invoice.number}</div>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownload} disabled={downloading}>
          {downloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />} PDF
        </Button>
      </div>

      <div className="docket-stub my-3" />

      <div className="space-y-1.5 text-sm">
        {invoice.lines.map((l) => (
          <div key={l.id} className="flex justify-between text-muted-foreground">
            <span>{l.description}</span>
            <span>{formatGBP(l.qty * l.unitPrice)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-border/70 pt-1.5">
          <span className="text-muted-foreground">VAT</span>
          <span>{formatGBP(vat)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatGBP(total)}</span>
        </div>
      </div>

      {invoice.status === "paid" ? (
        <div className="mt-4 rounded-md bg-success/10 px-3 py-2 text-sm text-success">
          Paid{invoice.paidAt ? ` on ${new Date(invoice.paidAt).toLocaleDateString("en-GB")}` : ""} — thank you.
        </div>
      ) : invoice.status === "pay_later" ? (
        <div className="mt-4 rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
          Pay later selected. This invoice remains due by {new Date(invoice.dueAt).toLocaleDateString("en-GB")}.
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button className="flex-1" onClick={() => handlePay("card")} disabled={paying !== null}>
            {paying === "card" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />} Pay now
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => handlePay("pay_later")} disabled={paying !== null}>
            {paying === "pay_later" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarClock className="h-4 w-4" />} Pay later
          </Button>
        </div>
      )}
      <p className="mt-2 text-[11px] text-muted-foreground">
        Safepay sandbox checkout is enabled for testing. No real money is moved.
      </p>
    </div>
  );
}
