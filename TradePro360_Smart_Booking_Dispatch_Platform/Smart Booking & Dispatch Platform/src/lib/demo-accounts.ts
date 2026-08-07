export const OWNER_DEMO_ACCOUNT = {
  name: "TradeWeb Owner",
  email: "owner@tradeweb.co.uk",
  password: "Owner123!",
} as const;

export const CLIENT_DEMO_ACCOUNTS = [
  { customerId: "cus-1", name: "Amelia Brown", email: "amelia.brown@example.co.uk", password: "Client123!" },
  { customerId: "cus-2", name: "George Evans", email: "george.evans@example.co.uk", password: "Client123!" },
  { customerId: "cus-3", name: "Charlotte King", email: "charlotte.king@example.co.uk", password: "Client123!" },
  { customerId: "cus-4", name: "Harry Clarke", email: "harry.clarke@example.co.uk", password: "Client123!" },
] as const;

export type DemoRole = "owner" | "client";

export interface DemoSession {
  role: DemoRole;
  name: string;
  email: string;
  customerId?: string;
}
