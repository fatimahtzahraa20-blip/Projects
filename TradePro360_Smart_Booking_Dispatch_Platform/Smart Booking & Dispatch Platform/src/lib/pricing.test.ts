import { describe, expect, it } from "vitest";

import { calculateQuote, formatGBP, partsFor } from "@/lib/pricing";

describe("calculateQuote", () => {
  it("calculates UK VAT and emergency labour premiums", () => {
    const quote = calculateQuote("plumbing", "emergency", 2, ["p2", "p5"]);

    expect(quote.callOut).toBe(85);
    expect(quote.labour).toBe(195);
    expect(quote.urgencyPremium).toBe(65);
    expect(quote.partsCost).toBe(13);
    expect(quote.subtotal).toBe(293);
    expect(quote.vat).toBe(58.6);
    expect(quote.total).toBe(351.6);
  });

  it("only exposes parts for the selected trade", () => {
    expect(partsFor("electrical")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "p3", category: "electrical" }),
        expect.objectContaining({ id: "p6", category: "electrical" }),
      ]),
    );
    expect(partsFor("electrical").every((part) => part.category === "electrical")).toBe(true);
  });

  it("formats totals as GBP", () => {
    expect(formatGBP(351.6)).toContain("351.60");
    expect(formatGBP(351.6)).toContain("£");
  });
});
