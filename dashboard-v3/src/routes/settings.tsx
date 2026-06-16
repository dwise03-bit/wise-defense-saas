import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save, KeyRound, Bell, Server, Shield } from "lucide-react";
import { Panel, PageHeader, StatusDot } from "@/components/cyber/Panel";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [apiBase, setApiBase] = useState(
    (import.meta.env.VITE_API_BASE as string | undefined) ?? "http://localhost:3000",
  );
  const [token, setToken] = useState("");
  const [notifs, setNotifs] = useState(true);
  const [alerts, setAlerts] = useState(true);
  const [autoRoute, setAutoRoute] = useState(true);

  return (
    <>
      <PageHeader title="Settings" subtitle="operator config" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Backend" right={<Server className="h-4 w-4 text-neon" />}>
          <Field label="API Base URL">
            <input value={apiBase} onChange={(e) => setApiBase(e.target.value)}
              className="w-full bg-black/50 border border-border focus:border-neon rounded px-3 py-2 font-mono text-sm outline-none" />
          </Field>
          <Field label="Bearer Token">
            <input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="••••••••"
              className="w-full bg-black/50 border border-border focus:border-neon rounded px-3 py-2 font-mono text-sm outline-none" />
          </Field>
          <div className="flex items-center gap-2 mt-3 text-xs font-mono">
            <StatusDot tone="success" />
            <span className="text-success">CONNECTED</span>
            <span className="text-muted-foreground">· last handshake 2s ago</span>
          </div>
        </Panel>
        <Panel title="Security" right={<Shield className="h-4 w-4 text-neon" />}>
          <Toggle label="Two-factor authentication" description="Require TOTP for command execution" checked={true} onChange={() => {}} />
          <Toggle label="Strict origin checks" description="Reject requests outside whitelist" checked={true} onChange={() => {}} />
          <Toggle label="Audit log shipping" description="Stream to remote SIEM" checked={false} onChange={() => {}} />
        </Panel>
        <Panel title="AI Routing" right={<KeyRound className="h-4 w-4 text-neon" />}>
          <Field label="Default Provider">
            <select className="w-full bg-black/50 border border-border focus:border-neon rounded px-3 py-2 font-mono text-sm outline-none">
              {["Auto", "Hermes", "Claude", "OpenAI"].map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <Toggle label="Adaptive routing" description="Use cheapest provider that meets SLA" checked={autoRoute} onChange={setAutoRoute} />
        </Panel>
        <Panel title="Notifications" right={<Bell className="h-4 w-4 text-neon" />}>
          <Toggle label="Deploy events" description="Notify on successful deploy" checked={notifs} onChange={setNotifs} />
          <Toggle label="Critical alerts" description="Pager on container failures" checked={alerts} onChange={setAlerts} />
        </Panel>
      </div>
      <div className="mt-6 flex justify-end">
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded neon-border bg-primary/20 text-neon font-mono uppercase tracking-wider text-sm hover:bg-primary/30">
          <Save className="h-4 w-4" /> Save Configuration
        </button>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mb-4">
      <div className="text-[11px] uppercase font-mono tracking-wider text-muted-foreground mb-1">{label}</div>
      {children}
    </label>
  );
}

function Toggle({ label, description, checked, onChange }: {
  label: string; description?: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between py-2.5 border-b border-border/60 last:border-0 text-left">
      <div>
        <div className="text-sm font-mono">{label}</div>
        {description && <div className="text-[11px] text-muted-foreground">{description}</div>}
      </div>
      <span className={`relative inline-flex h-5 w-10 items-center rounded-full transition ${checked ? "bg-primary/40 neon-border" : "bg-white/10 border border-border"}`}>
        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-neon transition ${checked ? "translate-x-5" : "translate-x-1"}`}
          style={{ boxShadow: checked ? "0 0 8px oklch(0.82 0.2 225)" : "none" }} />
      </span>
    </button>
  );
}
