"use client"
import React from "react";

export default function GlobalError({ error, reset }: { error: Error; reset?: () => void }) {
  return (
    <html>
      <body style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
        <main style={{ maxWidth: 900, margin: "0 auto" }}>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>Application error — diagnostic page</h1>
          <p style={{ marginBottom: 16 }}>The application encountered an unexpected error during rendering.</p>
          <section style={{ background: "#111", color: "#fff", padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <strong style={{ display: "block", marginBottom: 6 }}>Error message</strong>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 13 }}>{String(error?.message)}</pre>
          </section>
          <section style={{ background: "#f7f7f7", padding: 12, borderRadius: 8 }}>
            <strong style={{ display: "block", marginBottom: 6 }}>Stack</strong>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{String(error?.stack)}</pre>
          </section>
          <div style={{ marginTop: 16 }}>
            <button onClick={() => reset && reset()} style={{ padding: "10px 14px", borderRadius: 8, border: "none", background: "#111", color: "#fff" }}>Try again</button>
          </div>
        </main>
      </body>
    </html>
  );
}
