import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RefreshCw, ScrollText, Search } from "lucide-react";
import { Panel, PageHeader, StatusDot } from "@/components/cyber/Panel";

export const Route = createFileRoute("/infrastructure")({
  component: Infrastructure,
});

type Service = {
  id: string;
  name: string;
  image: string;
  status: "running" | "stopped" | "degraded";
  uptime: string;
  cpu: number;
  mem: string;
};

function statusTone(s: Service["status"]) {
  return s === "running" ? "success" : s === "stopped" ? "danger" : "warning";
}

function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading]   = useState(true);

  async function load() {
    try {
      const r = await fetch("/services");
      const data: Service[] = await r.json();
      setServices(data);
    } catch {}
    finally { setLoading(false); }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  return { services, loading, reload: load };
}

function Infrastructure() {
  const { services, loading, reload } = useServices();
  const [q, setQ]           = useState("");
  const [logsFor, setLogsFor] = useState<Service | null>(null);
  const [busy, setBusy]     = useState<string | null>(null);

  const list = services.filter(s =>
    s.name.toLowerCase().includes(q.toLowerCase()) ||
    s.image.toLowerCase().includes(q.toLowerCase())
  );

  async function restart(svc: Service) {
    setBusy(svc.id);
    try {
      await fetch(`/services/${encodeURIComponent(svc.name)}/restart`, { method: "POST" });
      setTimeout(reload, 800);
    } catch {}
    finally { setTimeout(() => setBusy(null), 800); }
  }

  return (
    <>
      <PageHeader title="Infrastructure" subtitle="service registry" />
      <Panel
        title={`Services${loading ? "" : ` (${services.length})`}`}
        right={
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="search…"
                className="pl-7 pr-2 py-1 text-xs font-mono rounded bg-black/40 border border-border focus:border-neon outline-none w-44"
              />
            </div>
            <button onClick={reload} className="text-muted-foreground hover:text-neon transition">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        }
      >
        {loading && services.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground font-mono text-xs animate-pulse">scanning containers…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase font-mono tracking-wider text-muted-foreground">
                  <th className="text-left py-2 px-2">Container</th>
                  <th className="text-left">Image</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Uptime</th>
                  <th className="text-left">CPU</th>
                  <th className="text-left">Mem</th>
                  <th className="text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {list.map(s => (
                  <tr key={s.id} className="border-t border-border/60 hover:bg-white/5">
                    <td className="py-2 px-2 text-foreground text-xs">{s.name}</td>
                    <td className="text-muted-foreground text-xs">{s.image}</td>
                    <td>
                      <span className="inline-flex items-center gap-2 text-xs uppercase">
                        <StatusDot tone={statusTone(s.status)} />
                        <span className={s.status === "running" ? "text-success" : s.status === "stopped" ? "text-destructive" : "text-warning"}>
                          {s.status}
                        </span>
                      </span>
                    </td>
                    <td className="text-muted-foreground text-xs">{s.uptime}</td>
                    <td className="text-xs">{s.cpu}%</td>
                    <td className="text-xs">{s.mem}</td>
                    <td className="text-right pr-2">
                      <div className="inline-flex gap-2">
                        <button
                          disabled={busy === s.id || s.status === "stopped"}
                          onClick={() => restart(s)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded border border-border hover:border-neon hover:text-neon transition disabled:opacity-40"
                        >
                          <RefreshCw className={`h-3 w-3 ${busy === s.id ? "animate-spin" : ""}`} />
                          Restart
                        </button>
                        <button
                          onClick={() => setLogsFor(s)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded border border-border hover:border-neon hover:text-neon transition"
                        >
                          <ScrollText className="h-3 w-3" />
                          Logs
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      {logsFor && <LogsModal svc={logsFor} onClose={() => setLogsFor(null)} />}
    </>
  );
}

function LogsModal({ svc, onClose }: { svc: Service; onClose: () => void }) {
  const [logs, setLogs] = useState<string>("Loading…");

  useEffect(() => {
    fetch(`/services/${encodeURIComponent(svc.name)}/logs`)
      .then(r => r.text())
      .catch(() => null)
      .then(text => {
        if (text) setLogs(text);
        else setLogs("(no logs available)");
      });
  }, [svc.name]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="glass w-full max-w-3xl rounded-lg neon-border">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
          <div className="font-mono text-xs uppercase tracking-wider text-neon">logs · {svc.name}</div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xs font-mono">CLOSE ✕</button>
        </div>
        <pre className="p-4 max-h-[60vh] overflow-auto font-mono text-[11px] leading-relaxed text-muted-foreground">{logs}</pre>
      </div>
    </div>
  );
}
