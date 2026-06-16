import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Send, Brain, User } from "lucide-react";
import { Panel, PageHeader, StatusDot } from "@/components/cyber/Panel";

export const Route = createFileRoute("/intelligence")({
  component: Intelligence,
});

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "";
const PROVIDERS = ["Auto", "Hermes", "Claude", "OpenAI"] as const;
type Provider = (typeof PROVIDERS)[number];
type Msg = { role: "user" | "assistant"; content: string; provider?: Provider };

function Intelligence() {
  const [provider, setProvider] = useState<Provider>("Auto");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", provider: "Hermes", content: "Intelligence channel established. Pick a provider or leave on Auto and I will route to the best available model." },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setBusy(true);
    try {
      let reply = "";
      let usedProvider: Provider = provider;
      if (API_BASE) {
        const r = await fetch(`${API_BASE}/ai/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider, messages: next }),
        });
        const j = (await r.json()) as { content: string; provider?: Provider };
        reply = j.content;
        if (j.provider) usedProvider = j.provider;
      } else {
        await new Promise((r) => setTimeout(r, 700));
        usedProvider = provider === "Auto" ? "Hermes" : provider;
        reply = `[${usedProvider}] Acknowledged. Set VITE_API_BASE to your VPS to enable live responses.`;
      }
      setMessages((m) => [...m, { role: "assistant", content: reply, provider: usedProvider }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: `error: ${(e as Error).message}` }]);
    } finally {
      setBusy(false);
      requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
    }
  }

  return (
    <>
      <PageHeader title="Intelligence" subtitle="ai operator" />
      <Panel
        title="AI Chat"
        right={
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-success">
              <StatusDot tone="success" /> CONNECTED
            </span>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as Provider)}
              className="bg-black/50 border border-border focus:border-neon rounded px-2 py-1 font-mono text-xs outline-none"
            >
              {PROVIDERS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        }
      >
        <div className="flex flex-col h-[60vh]">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "assistant" && (
                  <div className="h-8 w-8 rounded-md grid place-items-center neon-border shrink-0">
                    <Brain className="h-4 w-4 text-neon" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm font-mono leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary/15 border border-primary/40 text-foreground"
                    : "bg-black/40 border border-border text-foreground"
                }`}>
                  {m.role === "assistant" && m.provider && (
                    <div className="text-[10px] uppercase tracking-wider text-neon mb-1">{m.provider}</div>
                  )}
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
                {m.role === "user" && (
                  <div className="h-8 w-8 rounded-md grid place-items-center border border-border bg-black/40 shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {busy && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-md grid place-items-center neon-border">
                  <Brain className="h-4 w-4 text-neon animate-pulse" />
                </div>
                <div className="bg-black/40 border border-border rounded-lg px-4 py-2.5 text-sm font-mono text-muted-foreground">
                  <span className="inline-block animate-pulse">thinking…</span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="mt-4 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="> transmit query…"
              className="flex-1 bg-black/50 border border-border focus:border-neon rounded px-3 py-2.5 font-mono text-sm outline-none"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="inline-flex items-center gap-2 px-4 py-2.5 neon-border bg-primary/20 text-neon font-mono uppercase tracking-wider text-sm rounded hover:bg-primary/30 disabled:opacity-50"
            >
              <Send className="h-4 w-4" /> Send
            </button>
          </form>
        </div>
      </Panel>
    </>
  );
}
