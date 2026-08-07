"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CUSTOMERS, ENGINEERS, INVOICES, JOBS } from "@/lib/mock-data";
import type {
  BrandSettings,
  ChatMessage,
  Customer,
  Engineer,
  Invoice,
  Job,
  JobStatus,
} from "@/types/domain";

export const BRAND_PRESETS: { name: string; primary: string; accent: string }[] = [
  { name: "Trade Blue", primary: "oklch(0.47 0.14 250)", accent: "oklch(0.7 0.19 45)" },
  { name: "Safety Orange", primary: "oklch(0.62 0.19 42)", accent: "oklch(0.45 0.13 250)" },
  { name: "Forest Service", primary: "oklch(0.42 0.1 155)", accent: "oklch(0.75 0.17 85)" },
  { name: "Signal Red", primary: "oklch(0.52 0.2 25)", accent: "oklch(0.3 0.02 250)" },
  { name: "Slate Pro", primary: "oklch(0.35 0.02 260)", accent: "oklch(0.65 0.16 200)" },
];

const DEFAULT_BRAND: BrandSettings = {
  companyName: "TradeWeb",
  tagline: "Trusted trades, dispatched in minutes.",
  primaryColor: BRAND_PRESETS[0].primary,
  accentColor: BRAND_PRESETS[0].accent,
  logoInitials: "TW",
  vatNumber: "GB123456789",
  invoicePrefix: "TW-INV",
  phone: "+44 20 7946 0958",
  email: "hello@tradeweb.co.uk",
  serviceAreas: ["London", "Westminster", "Camden", "Islington", "Southwark"],
};

const SEED_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    jobId: "job-1",
    sender: "system",
    senderName: "TradeWeb",
    text: "Ali has been assigned to your job and is on the way.",
    at: new Date().toISOString(),
  },
  {
    id: "msg-2",
    jobId: "job-1",
    sender: "engineer",
    senderName: "Ali Raza",
    text: "Morning! I'm just finishing the job before yours, should be with you around 11:20am.",
    at: new Date().toISOString(),
  },
];

interface AppState {
  brand: BrandSettings;
  updateBrand: (patch: Partial<BrandSettings>) => void;
  applyPreset: (index: number) => void;

  jobs: Job[];
  updateJob: (id: string, patch: Partial<Job>) => void;
  addJobStatus: (id: string, status: JobStatus, note?: string) => void;
  addJob: (job: Job) => void;
  assignEngineer: (jobId: string, engineerId: string) => void;
  updateEngineerPosition: (engineerId: string, lat: number, lng: number) => void;

  engineers: Engineer[];
  customers: Customer[];
  invoices: Invoice[];
  markInvoicePaid: (id: string, method: "card" | "pay_later") => void;
  markInvoicePayLater: (id: string) => void;
  ensureInvoiceForJob: (job: Job) => void;

  messages: ChatMessage[];
  sendMessage: (msg: Omit<ChatMessage, "id" | "at">) => void;

  demoRole: "public" | "owner" | "engineer" | "customer";
  setDemoRole: (role: AppState["demoRole"]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      brand: DEFAULT_BRAND,
      updateBrand: (patch) => set((s) => ({ brand: { ...s.brand, ...patch } })),
      applyPreset: (index) =>
        set((s) => ({
          brand: {
            ...s.brand,
            primaryColor: BRAND_PRESETS[index].primary,
            accentColor: BRAND_PRESETS[index].accent,
          },
        })),

      jobs: JOBS,
      updateJob: (id, patch) =>
        set((s) => ({ jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)) })),
      addJobStatus: (id, status, note) =>
        set((s) => ({
          jobs: s.jobs.map((j) =>
            j.id === id
              ? {
                  ...j,
                  status,
                  timeline: [...j.timeline, { status, at: new Date().toISOString(), note }],
                }
              : j,
          ),
        })),
      addJob: (job) => set((s) => ({ jobs: [job, ...s.jobs] })),
      assignEngineer: (jobId, engineerId) =>
        set((s) => ({
          jobs: s.jobs.map((j) =>
            j.id === jobId
              ? {
                  ...j,
                  engineerId,
                  status: "assigned",
                  timeline: [...j.timeline, { status: "assigned", at: new Date().toISOString() }],
                }
              : j,
          ),
        })),
      updateEngineerPosition: (engineerId, lat, lng) =>
        set((s) => ({
          engineers: s.engineers.map((engineer) =>
            engineer.id === engineerId ? { ...engineer, position: { lat, lng } } : engineer,
          ),
        })),

      engineers: ENGINEERS,
      customers: CUSTOMERS,
      invoices: INVOICES,
      markInvoicePaid: (id, method) =>
        set((s) => ({
          invoices: s.invoices.map((inv) =>
            inv.id === id
              ? { ...inv, status: "paid", paidAt: new Date().toISOString(), paymentMethod: method }
              : inv,
          ),
        })),
      markInvoicePayLater: (id) =>
        set((s) => ({
          invoices: s.invoices.map((invoice) =>
            invoice.id === id ? { ...invoice, status: "pay_later", paymentMethod: "pay_later" } : invoice,
          ),
        })),
      ensureInvoiceForJob: (job) =>
        set((s) => {
          if (s.invoices.some((inv) => inv.jobId === job.id)) return s;
          const mid = (job.priceEstimate.low + job.priceEstimate.high) / 2;
          const labour = Math.round(mid * 0.7 * 100) / 100;
          const callOut = Math.round((mid - labour) * 100) / 100;
          const invoice: Invoice = {
            id: `inv-${Date.now()}`,
            number: `${s.brand.invoicePrefix}-${1000 + s.invoices.length + 1}`,
            jobId: job.id,
            issuedAt: new Date().toISOString(),
            dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            lines: [
              { id: "l1", description: `${job.service[0].toUpperCase()}${job.service.slice(1)} call-out & labour`, qty: 1, unitPrice: labour, type: "labour" },
              { id: "l2", description: "Call-out fee", qty: 1, unitPrice: Math.max(callOut, 25), type: "callout" },
            ],
            vatRate: 0.2,
            status: "sent",
          };
          return { invoices: [...s.invoices, invoice] };
        }),

      messages: SEED_MESSAGES,
      sendMessage: (msg) =>
        set((s) => ({
          messages: [
            ...s.messages,
            { ...msg, id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: new Date().toISOString() },
          ],
        })),

      demoRole: "public",
      setDemoRole: (role) => set({ demoRole: role }),
    }),
    {
      name: "tradeweb-uk-demo-store",
      partialize: (s) => ({
        brand: s.brand,
        jobs: s.jobs,
        engineers: s.engineers,
        customers: s.customers,
        messages: s.messages,
        invoices: s.invoices,
      }),
    },
  ),
);
