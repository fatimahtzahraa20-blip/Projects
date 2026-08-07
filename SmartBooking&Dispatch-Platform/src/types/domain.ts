export type ServiceCategory = "plumbing" | "electrical" | "cleaning" | "heating" | "locksmith";

export type Urgency = "emergency" | "today" | "scheduled";

export type JobStatus =
  | "lead"
  | "quote_requested"
  | "quoted"
  | "approved"
  | "unassigned"
  | "assigned"
  | "en_route"
  | "arrived"
  | "in_progress"
  | "paused"
  | "completed"
  | "invoiced"
  | "paid"
  | "cancelled";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Address {
  line1: string;
  city: string;
  postcode: string;
  lat: number;
  lng: number;
}

export interface Skill {
  id: string;
  name: string;
  category: ServiceCategory;
}

export interface Engineer {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  jobsCompleted: number;
  skills: ServiceCategory[];
  certifications: { name: string; expiresAt: string }[];
  status: "available" | "busy" | "offline" | "en_route";
  position: GeoPoint;
  vanReg: string;
  phone: string;
  workloadToday: number;
  maxWorkload: number;
  homeBase: string;
  employedSince: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  properties: number;
  lifetimeValue: number;
  jobsCount: number;
  tags: string[];
  memberSince: string;
}

export interface JobStatusEvent {
  status: JobStatus;
  at: string;
  note?: string;
}

export interface ChatMessage {
  id: string;
  jobId: string;
  sender: "customer" | "engineer" | "office" | "system";
  senderName: string;
  text: string;
  at: string;
  attachment?: string;
}

export interface InvoiceLine {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
  type: "labour" | "part" | "callout" | "discount";
}

export interface Invoice {
  id: string;
  number: string;
  jobId: string;
  issuedAt: string;
  dueAt: string;
  lines: InvoiceLine[];
  vatRate: number;
  status: "draft" | "sent" | "overdue" | "paid" | "pay_later";
  paidAt?: string;
  paymentMethod?: "card" | "pay_later" | "cash";
}

export interface Job {
  id: string;
  reference: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  address: Address;
  service: ServiceCategory;
  issue: string;
  urgency: Urgency;
  status: JobStatus;
  createdAt: string;
  scheduledWindow: { start: string; end: string } | null;
  engineerId: string | null;
  etaMinutes: number | null;
  priceEstimate: { low: number; high: number };
  photos: string[];
  notes: string;
  timeline: JobStatusEvent[];
  rating?: { stars: number; comment: string } | null;
  accessNotes?: string;
}

export interface DispatchCandidate {
  engineerId: string;
  score: number;
  distanceKm: number;
  etaMinutes: number;
  reasons: string[];
  skillMatch: boolean;
  workloadOk: boolean;
}

export interface UKPart {
  id: string;
  name: string;
  category: ServiceCategory;
  supplier: string;
  price: number;
  unit: string;
  lastUpdated: string;
}

export interface BrandSettings {
  companyName: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  logoInitials: string;
  vatNumber: string;
  invoicePrefix: string;
  phone: string;
  email: string;
  serviceAreas: string[];
}
