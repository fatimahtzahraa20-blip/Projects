"use client";

import { useState } from "react";
import { LockKeyhole, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CLIENT_DEMO_ACCOUNTS, OWNER_DEMO_ACCOUNT, type DemoRole } from "@/lib/demo-accounts";
import { useAuthStore } from "@/store/auth-store";

export function DemoLogin({ role }: { role: DemoRole }) {
  const defaultAccount = role === "owner" ? OWNER_DEMO_ACCOUNT : CLIENT_DEMO_ACCOUNTS[0];
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState<string>(defaultAccount.email);
  const [password, setPassword] = useState<string>(defaultAccount.password);
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!login(role, email, password)) {
      setError("Email or password is incorrect.");
      return;
    }
    setError("");
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {role === "owner" ? <LockKeyhole className="h-5 w-5" /> : <Users className="h-5 w-5" />}
          </div>
          <CardTitle>{role === "owner" ? "Owner dashboard login" : "Client portal login"}</CardTitle>
          <CardDescription>Use one of the default demo accounts below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-2">
              <Label htmlFor={`${role}-email`}>Email</Label>
              <Input id={`${role}-email`} type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${role}-password`}>Password</Label>
              <Input id={`${role}-password`} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button className="w-full" type="submit">Log in</Button>
          </form>

          <div className="mt-6 rounded-lg border bg-muted/40 p-3 text-xs">
            <p className="font-semibold">Default demo credentials</p>
            {role === "owner" ? (
              <button type="button" className="mt-2 block w-full rounded-md p-2 text-left hover:bg-muted" onClick={() => { setEmail(OWNER_DEMO_ACCOUNT.email); setPassword(OWNER_DEMO_ACCOUNT.password); }}>
                <span className="block font-medium">{OWNER_DEMO_ACCOUNT.name}</span>
                <span className="text-muted-foreground">{OWNER_DEMO_ACCOUNT.email} · {OWNER_DEMO_ACCOUNT.password}</span>
              </button>
            ) : (
              <div className="mt-2 space-y-1">
                {CLIENT_DEMO_ACCOUNTS.map((account) => (
                  <button key={account.customerId} type="button" className="block w-full rounded-md p-2 text-left hover:bg-muted" onClick={() => { setEmail(account.email); setPassword(account.password); }}>
                    <span className="block font-medium">{account.name}</span>
                    <span className="text-muted-foreground">{account.email} · {account.password}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">Demo access only — do not use these credentials in production.</p>
        </CardContent>
      </Card>
    </div>
  );
}
