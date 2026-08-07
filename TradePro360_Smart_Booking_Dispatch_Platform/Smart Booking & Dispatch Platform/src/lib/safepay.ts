import { createHmac, timingSafeEqual } from "node:crypto";
import { Safepay } from "@sfpy/node-sdk";

export function getSandboxSafepay() {
  const apiKey = process.env.SAFEPAY_API_KEY;
  const v1Secret = process.env.SAFEPAY_V1_SECRET;
  if (!apiKey || !v1Secret) return null;
  const environment = "sandbox" as ConstructorParameters<typeof Safepay>[0]["environment"];
  // The SDK requires this field even when `webhooks: false`. It is never used
  // by this sandbox-only hosted checkout flow.
  const webhookSecret = process.env.SAFEPAY_WEBHOOK_SECRET || "sandbox-webhooks-disabled";
  return new Safepay({ environment, apiKey, v1Secret, webhookSecret });
}

export function safepayProof(reference: string, tracker: string) {
  const secret = process.env.SAFEPAY_V1_SECRET;
  return secret ? createHmac("sha256", secret).update(`${reference}:${tracker}`).digest("hex") : "";
}

export function validSafepayProof(reference: string, tracker: string, proof: string) {
  const expected = safepayProof(reference, tracker);
  return !!expected && expected.length === proof.length && timingSafeEqual(Buffer.from(expected), Buffer.from(proof));
}
