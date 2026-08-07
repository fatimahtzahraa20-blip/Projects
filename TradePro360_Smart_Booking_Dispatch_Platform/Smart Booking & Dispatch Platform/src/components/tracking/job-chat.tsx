"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/domain";

export function JobChat({ jobId, asSender }: { jobId: string; asSender: ChatMessage["sender"] }) {
  const allMessages = useAppStore((s) => s.messages);
  const messages = allMessages.filter((message) => message.jobId === jobId);
  const sendMessage = useAppStore((s) => s.sendMessage);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  function send() {
    if (!text.trim()) return;
    sendMessage({
      jobId,
      sender: asSender,
      senderName: asSender === "customer" ? "You" : asSender === "engineer" ? "Engineer" : "Office",
      text: text.trim(),
    });
    setText("");
  }

  return (
    <div className="flex h-80 flex-col rounded-lg border border-border/80">
      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {messages.length === 0 && (
          <p className="mt-6 text-center text-sm text-muted-foreground">No messages yet — say hello.</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.sender === asSender ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                m.sender === asSender
                  ? "bg-primary text-primary-foreground"
                  : m.sender === "system"
                    ? "bg-muted text-muted-foreground italic"
                    : "bg-muted",
              )}
            >
              {m.sender !== asSender && m.sender !== "system" && (
                <div className="mb-0.5 text-[10px] font-medium opacity-70">{m.senderName}</div>
              )}
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex items-center gap-2 border-t border-border/80 p-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message…"
          className="h-9"
        />
        <Button size="icon" className="h-9 w-9 shrink-0" onClick={send} aria-label="Send message">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
