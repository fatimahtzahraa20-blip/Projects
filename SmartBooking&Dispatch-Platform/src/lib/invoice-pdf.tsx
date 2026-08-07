"use client";

import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import type { BrandSettings, Invoice, Job } from "@/types/domain";
import { formatGBP } from "@/lib/pricing";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#1a1a1a" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  brand: { fontSize: 18, fontWeight: 700 },
  small: { fontSize: 9, color: "#555", marginTop: 2 },
  section: { marginBottom: 16 },
  label: { fontSize: 8, textTransform: "uppercase", color: "#888", letterSpacing: 1, marginBottom: 3 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#eee" },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#333", paddingBottom: 6, marginTop: 10 },
  th: { fontSize: 8, textTransform: "uppercase", color: "#555", letterSpacing: 0.5 },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  totalLabel: { fontSize: 10, color: "#555" },
  grandTotal: { fontSize: 13, fontWeight: 700, marginTop: 4 },
  footer: { marginTop: 40, fontSize: 8, color: "#999", borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 12 },
  badge: { fontSize: 9, backgroundColor: "#eef2ff", color: "#3730a3", padding: 4, borderRadius: 3, alignSelf: "flex-start" },
});

interface InvoiceDocProps {
  job: Job;
  invoice: Invoice;
  brand: BrandSettings;
}

function InvoiceDocument({ job, invoice, brand }: InvoiceDocProps) {
  const subtotal = invoice.lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);
  const vat = subtotal * invoice.vatRate;
  const total = subtotal + vat;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>{brand.companyName}</Text>
            <Text style={styles.small}>{brand.tagline}</Text>
            <Text style={styles.small}>{brand.phone} · {brand.email}</Text>
            <Text style={styles.small}>VAT registration number: {brand.vatNumber}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 14, fontWeight: 700 }}>INVOICE</Text>
            <Text style={styles.small}>{invoice.number}</Text>
            <Text style={styles.small}>Issued {new Date(invoice.issuedAt).toLocaleDateString("en-GB")}</Text>
            <Text style={styles.small}>Due {new Date(invoice.dueAt).toLocaleDateString("en-GB")}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Billed to</Text>
          <Text>{job.customerName}</Text>
          <Text style={styles.small}>{job.address.line1}, {job.address.city} {job.address.postcode}</Text>
          <Text style={styles.small}>{job.customerPhone}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Job reference</Text>
          <Text>{job.reference} — {job.issue}</Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.th, { flex: 3 }]}>Description</Text>
          <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>Qty</Text>
          <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>Unit</Text>
          <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>Total</Text>
        </View>
        {invoice.lines.map((l) => (
          <View style={styles.row} key={l.id}>
            <Text style={{ flex: 3 }}>{l.description}</Text>
            <Text style={{ flex: 1, textAlign: "right" }}>{l.qty}</Text>
            <Text style={{ flex: 1, textAlign: "right" }}>{formatGBP(l.unitPrice)}</Text>
            <Text style={{ flex: 1, textAlign: "right" }}>{formatGBP(l.qty * l.unitPrice)}</Text>
          </View>
        ))}

        <View style={{ marginTop: 10, alignItems: "flex-end" }}>
          <View style={{ width: 200 }}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text>{formatGBP(subtotal)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalLabel}>VAT ({Math.round(invoice.vatRate * 100)}%)</Text>
              <Text>{formatGBP(vat)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.grandTotal}>Total due</Text>
              <Text style={styles.grandTotal}>{formatGBP(total)}</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.badge}>
            {invoice.status === "paid" ? `Paid ${invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString("en-GB") : ""}` : invoice.status === "pay_later" ? "Pay later — due on completion" : "Payment due"}
          </Text>
        </View>

        <Text style={styles.footer}>
          {brand.companyName} · {brand.serviceAreas.join(", ")} · This is a demo invoice generated for illustration
          purposes within the TradeWeb platform preview.
        </Text>
      </Page>
    </Document>
  );
}

export async function downloadInvoicePdf(job: Job, invoice: Invoice, brand: BrandSettings) {
  const blob = await pdf(<InvoiceDocument job={job} invoice={invoice} brand={brand} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${invoice.number}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
