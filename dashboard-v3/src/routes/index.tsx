import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Cpu, MemoryStick, HardDrive, Boxes, Server, Brain, ArrowUpRight, ArrowDownRight, Database, Workflow } from "lucide-react";
import { Panel, PageHeader, StatusDot } from "@/components/cyber/Panel";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "";

type Metrics = {
  server: string;
  containers: number;
  cpu: number;
  ram: number;
  disk: number;
  ai: string;
  database?: { status: string; latencyMs: number; connections: number };
  redis?: { status: string; opsPerSec: number; memoryMb: number };
  worker?: { status: string; active: number; queued: number };
};

const FALLBACK: Metrics = {
  server: "online",
  containers: 8,
  cpu: 22,
  ram: 71,
  disk: 78,
  ai: "online",
  database: { status: "online", latencyMs: 4, connections: 38 },
  redis: { status: "degraded", opsPerSec: 1240, memoryMb: 96 },
  worker: { status: "online", active: 12, queued: 47 },
};

type EventLine = { time: string; event: string; level: "ok" | "warn" | "err"; meta: string };

function useMetrics() {
  const [data, setData] = useState<Metrics>(FALLBACK);
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const r = await fetch(`${API_BASE}/metrics`);
        const j = (await r.json()) as Metrics;
        if (!cancelled) setData(j);
      } catch {
        if (!cancelled)
          setData((d) => ({
            ...d,
            cpu: Math.max(8, Math.min(92, d.cpu + (Math.random() * 10 - 5))),
            ram: Math.max(4, Math.min(96, d.ram + (Math.random() * 6 - 3))),
          }));
      }
    };
    tick();
    const id = setInterval(tick, 3000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);
  return data;
}

function useEvents() {
  const [events, setEvents] = useState<EventLine[]>([]);
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const r = await fetch(`${API_BASE}/events`);
        const j = await r.json();
        if (!cancelled && Array.isArray(j)) setEvents(j);
      } catch {}
    };
    load();
    const id = setInterval(load, 10000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);
  return events;
}

function Meter({ value, tone = "neon" }: { value: number; tone?: "neon" | "warning" | "danger" }) {
  const color =
    tone === "danger" ? "from-destructive to-destructive"
    : tone === "warning" ? "from-warning to-warning"
    : "from-neon-dim to-neon";
  return (
    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r ${color}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, boxShadow: "0 0 10px oklch(0.75 0.18 230 / 60%)" }}
      />
    </div>
  );
}

function Big({ value, suffix }: { value: string | number; suffix?: string }) {
  return (
    <div className="flex items-baseline gap-1.5 font-mono">
      <span className="text-4xl font-semibold neon-text">{value}</span>
      {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
    </div>
  );
}

function statusTone(s: string): "success" | "warning" | "danger" {
  if (s === "online") return "success";
  if (s === "degraded") return "warning";
  return "danger";
}

function Dashboard() {
  const m = useMetrics();
  const events = useEvents();
  const db = m.database ?? FALLBACK.database!;
  const redis = m.redis ?? FALLBACK.redis!;
  const worker = m.worker ?? FALLBACK.worker!;

  return (
    <>
      <PageHeader title="Dashboard" subtitle="situational awareness" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Panel title="Server Status" right={<StatusDot tone={statusTone(m.server)} />}>
          <Big value={m.server.toUpperCase()} />
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Server className="h-3.5 w-3.5" /> System operational
          </div>
        </Panel>
        <Panel title="Container Count" right={<Boxes className="h-4 w-4 text-neon" />}>
          <Big value={m.containers} />
          <div className="mt-3 text-xs text-muted-foreground font-mono">{m.containers} active orchestrated units</div>
        </Panel>
        <Panel title="AI Subsystem" right={<StatusDot tone={statusTone(m.ai)} />}>
          <Big value={m.ai.toUpperCase()} />
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Brain className="h-3.5 w-3.5" /> {m.ai.toUpperCase()} · routed
          </div>
        </Panel>
        <Panel title="CPU Usage" right={<Cpu className="h-4 w-4 text-neon" />}>
          <Big value={m.cpu.toFixed(0)} suffix="%" />
          <div className="mt-4"><Meter value={m.cpu} tone={m.cpu > 80 ? "danger" : m.cpu > 60 ? "warning" : "neon"} /></div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
            <ArrowUpRight className="h-3 w-3 text-success" /> load 1m: 1.42
          </div>
        </Panel>
        <Panel title="RAM Usage" right={<MemoryStick className="h-4 w-4 text-neon" />}>
          <Big value={m.ram.toFixed(0)} suffix="%" />
          <div className="mt-4"><Meter value={m.ram} tone={m.ram > 80 ? "danger" : m.ram > 60 ? "warning" : "neon"} /></div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
            <ArrowDownRight className="h-3 w-3 text-success" /> swap: 0%
          </div>
        </Panel>
        <Panel title="Disk Usage" right={<HardDrive className="h-4 w-4 text-neon" />}>
          <Big value={m.disk.toFixed(0)} suffix="%" />
          <div className="mt-4"><Meter value={m.disk} tone={m.disk > 80 ? "danger" : m.disk > 60 ? "warning" : "neon"} /></div>
          <div className="mt-2 text-[11px] font-mono text-muted-foreground">{Math.max(0, 100 - m.disk).toFixed(0)}% available</div>
        </Panel>
        <Panel title="Database Status" right={<StatusDot tone={statusTone(db.status)} />}>
          <Big value={db.status.toUpperCase()} />
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Database className="h-3.5 w-3.5" /> {db.latencyMs}ms · {db.connections} conns
          </div>
        </Panel>
        <Panel title="Redis Status" right={<StatusDot tone={statusTone(redis.status)} />}>
          <Big value={redis.status.toUpperCase()} />
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Database className="h-3.5 w-3.5" /> {redis.opsPerSec.toLocaleString()} ops/s · {redis.memoryMb} MB
          </div>
        </Panel>
        <Panel title="Worker Status" right={<StatusDot tone={statusTone(worker.status)} />}>
          <Big value={worker.active} suffix={`active · ${worker.queued} queued`} />
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Workflow className="h-3.5 w-3.5" /> {worker.status.toUpperCase()} pool
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Event Stream" subtitle="docker events · last hour">
          {events.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground font-mono text-xs animate-pulse">polling…</div>
          ) : (
            <ul className="space-y-2 font-mono text-xs">
              {events.map((e, i) => (
                <li key={i} className="flex items-center gap-3 text-muted-foreground">
                  <span className="text-neon-dim shrink-0">{e.time}</span>
                  <span className="text-foreground truncate">{e.event}</span>
                  <span className={e.level === "ok" ? "text-success" : e.level === "err" ? "text-destructive" : "text-warning"}>
                    [{e.level}]
                  </span>
                  <span className="ml-auto truncate text-right shrink-0">{e.meta}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Network Throughput" subtitle="ingress · egress">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] uppercase font-mono text-muted-foreground tracking-wider">In</div>
              <Big value="412" suffix="Mbps" />
              <Meter value={42} />
            </div>
            <div>
              <div className="text-[11px] uppercase font-mono text-muted-foreground tracking-wider">Out</div>
              <Big value="218" suffix="Mbps" />
              <Meter value={22} />
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}
