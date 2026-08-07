"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CLIENT_DEMO_ACCOUNTS, OWNER_DEMO_ACCOUNT, type DemoRole, type DemoSession } from "@/lib/demo-accounts";

interface AuthState {
  session: DemoSession | null;
  hydrated: boolean;
  login: (role: DemoRole, email: string, password: string) => boolean;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      hydrated: false,
      login: (role, email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        if (role === "owner") {
          if (normalizedEmail !== OWNER_DEMO_ACCOUNT.email || password !== OWNER_DEMO_ACCOUNT.password) return false;
          set({ session: { role, name: OWNER_DEMO_ACCOUNT.name, email: OWNER_DEMO_ACCOUNT.email } });
          return true;
        }

        const account = CLIENT_DEMO_ACCOUNTS.find(
          (candidate) => candidate.email === normalizedEmail && candidate.password === password,
        );
        if (!account) return false;
        set({ session: { role, name: account.name, email: account.email, customerId: account.customerId } });
        return true;
      },
      logout: () => set({ session: null }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "tradeweb-uk-demo-auth",
      partialize: (state) => ({ session: state.session }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
