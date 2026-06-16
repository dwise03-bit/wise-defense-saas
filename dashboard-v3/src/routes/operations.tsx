import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Rocket, Undo2, HeartPulse, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Panel, PageHeader } from "@/components/cyber/Panel";

export const Route = createFileRoute("/operations")({
  component: Operations,
});

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "";
type LogLine = { t: string; msg: string; level: "info" | "ok" | "err" };

function Operations() {
  const [target, setTarget] = useState("wise-api");
  const [version, setVersion] = useState("v1.84.3");
  const [running, setRunning] = useState<string | null>(null);
  const [log, setLog] = useState<LogLine[]>([{ t: "12:00:00", msg: "ops console ready", level: "info" }]);

  function append(line: LogLine) { setLog((l) => [...l, line]); }

  async function run(kind: "deploy" | "rollback" | "health") {
    setRunning(kind);
    append({ t: stamp(), msg: `→ ${kind} ${target}${kind === "deploy" ? ` @ ${version}` : ""}`, level: "info" });
    try {
      if (API_BASE) {
        const r = await fetch(`${API_BASE}/ops/${kind}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target, version }),
        });
        append({ t: stamp(), msg: `status ${r.status}`, level: r.ok ? "ok" : "err" });
      } else {
        await wait(900);
        append({ t: stamp(), msg: "pulling artifacts…", level: "info" });
        await wait(700);
        append({ t: stamp(), msg: "applying configuration", level: "info" });
        await wait(600);
        append({ t: stamp(), msg: `${kind} completed`, level: "ok" });
      }
    } catch (e) {
      append({ t: stamp(), msg: `error: ${(e as Error).message}`, level: "err" });
    } finally {
      setRunning(null);
    }
  }

  return (
    <>
      <PageHeader title="Operations" subtitle="control surface" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel title="Target">
          <label className="block text-[11px] uppercase font-mono text-muted-foreground tracking-wider">Service</label>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="mt-1 w-full bg-black/40 border border-border focus:border-neon rounded px-3 py-2 font-mono text-sm outline-none"
          >
            {["wise-api", "wise-web", "worker-pool", "hermes-ai", "edge-proxy"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <label className="block mt-4 text-[11px] uppercase font-mono text-muted-foreground tracking-wider">Version</label>
          <input
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="mt-1 w-full bg-black/40 border border-border focus:border-neon rounded px-3 py-2 font-mono text-sm outline-none"
          />
        </Panel>

        <Panel title="Actions" className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ActionButton icon={Rocket} label="Deploy" tone="neon" busy={running === "deploy"} onClick={() => run("deploy")} />
            <ActionButton icon={Undo2} label="Rollback" tone="warning" busy={running === "rollback"} onClick={() => run("rollback")} />
            <ActionButton icon={HeartPulse} label="Health Check" tone="success" busy={running === "health"} onClick={() => run("health")} />
          </div>
          <div className="mt-5">
            <div className="text-[11px] uppercase font-mono tracking-wider text-muted-foreground mb-2">Console</div>
            <div className="rounded border border-border bg-black/60 h-72 overflow-auto p-3 font-mono text-xs space-y-1">
              {log.map((l, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-neon-dim">{l.t}</span>
                  {l.level === "ok" && <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />}
                  {l.level === "err" && <XCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />}
                  <span className={l.level === "ok" ? "text-success" : l.level === "err" ? "text-destructive" : "text-foreground"}>
                    {l.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}

function ActionButton({ icon: Icon, label, busy, onClick, tone }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  busy: boolean;
  onClick: () => void;
  tone: "neon" | "warning" | "success";
}) {
  const ring = tone === "warning" ? "hover:border-warning hover:text-warning"
    : tone === "success" ? "hover:border-success hover:text-success"
    : "hover:border-neon hover:text-neon";
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={`glass glass-hover rounded-md p-5 flex flex-col items-center justify-center gap-2 border border-border transition ${ring} disabled:opacity-60`}
    >
      {busy ? <Loader2 className="h-6 w-6 animate-spin text-neon" /> : <Icon className="h-6 w-6" />}
      <span className="font-mono uppercase tracking-wider text-sm">{label}</span>
    </button>
  );
}

function stamp() { return new Date().toISOString().slice(11, 19); }
function wait(ms: number) { return new Promise((r) => setTimeout(r, ms)); }
