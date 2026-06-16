import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DollarSign, Users, Network, Briefcase, TrendingUp } from "lucide-react";
import { Panel, PageHeader } from "@/components/cyber/Panel";

export const Route = createFileRoute("/business")({
  component: Business,
});

type BizData = {
  revenue:  { mtd: number; changePct: number };
  tenants:  { total: number; weeklyNew: number };
  apiUsage: { daily: string; errorPct: number };
  worker:   { total: number; ok: number; retry: number; failed: number; queued: number };
};

const FALLBACK: BizData = {
  revenue:  { mtd: 184230,  changePct: 12.4 },
  tenants:  { total: 1284,  weeklyNew: 42 },
  apiUsage: { daily: "8.4M", errorPct: 0.12 },
  worker:   { total: 3124,  ok: 2948, retry: 142, failed: 34, queued: 0 },
};

function useBiz() {
  const [data, setData] = useState<BizData>(FALLBACK);
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const r = await fetch("/business");
        const j = await r.json();
        if (!cancelled) setData(j);
      } catch {}
    };
    load();
    const id = setInterval(load, 10000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);
  return data;
}

const REVENUE_SERIES = [12, 18, 14, 22, 28, 24, 31, 36, 33, 42, 48, 54];

function Sparkline({ data }: { data: number[] }) {
  const w = 240, h = 60;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.82 0.2 225)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="oklch(0.82 0.2 225)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill="url(#g)" />
      <polyline points={pts} fill="none" stroke="oklch(0.82 0.2 225)" strokeWidth="2"
        style={{ filter: "drop-shadow(0 0 6px oklch(0.82 0.2 225))" }} />
    </svg>
  );
}

function Business() {
  const biz = useBiz();
  const w = biz.worker;

  return (
    <>
      <PageHeader title="Business" subtitle="commercial telemetry" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Panel title="Revenue (MTD)" right={<DollarSign className="h-4 w-4 text-neon" />}>
          <div className="text-3xl font-mono font-semibold neon-text">${biz.revenue.mtd.toLocaleString()}</div>
          <div className="text-xs font-mono text-success flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" /> +{biz.revenue.changePct}% vs last
          </div>
          <Sparkline data={REVENUE_SERIES} />
        </Panel>

        <Panel title="Active Tenants" right={<Users className="h-4 w-4 text-neon" />}>
          <div className="text-3xl font-mono font-semibold neon-text">{biz.tenants.total.toLocaleString()}</div>
          <div className="text-xs font-mono text-muted-foreground mt-1">{biz.tenants.weeklyNew} onboarded this week</div>
          <div className="mt-4 grid grid-cols-3 gap-1 h-12">
            {Array.from({ length: 21 }).map((_, i) => (
              <div key={i} className="rounded-sm"
                style={{ height: `${20 + Math.sin(i) * 20 + i * 1.4}%`, background: "oklch(0.75 0.18 230 / 60%)", alignSelf: "end" }} />
            ))}
          </div>
        </Panel>

        <Panel title="API Usage (24h)" right={<Network className="h-4 w-4 text-neon" />}>
          <div className="text-3xl font-mono font-semibold neon-text">{biz.apiUsage.daily}</div>
          <div className="text-xs font-mono text-muted-foreground mt-1">req · {biz.apiUsage.errorPct}% errors</div>
          <Sparkline data={[20, 24, 18, 30, 28, 36, 42, 38, 44, 50, 47, 52]} />
        </Panel>

        <Panel title="Worker Jobs" right={<Briefcase className="h-4 w-4 text-neon" />}>
          <div className="text-3xl font-mono font-semibold neon-text">{w.total.toLocaleString()}</div>
          <div className="text-xs font-mono text-muted-foreground mt-1">
            <span className="text-success">{w.ok.toLocaleString()} ok</span>
            {" · "}
            <span className="text-warning">{w.retry} retry</span>
            {" · "}
            <span className="text-destructive">{w.failed} failed</span>
          </div>
          {w.queued > 0 && (
            <div className="mt-1 text-xs font-mono text-neon">{w.queued} queued in Redis</div>
          )}
          <div className="mt-4 flex items-end gap-1 h-12">
            {[8, 14, 9, 17, 12, 20, 18, 22, 16, 24, 20, 28].map((v, i) => (
              <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-neon-dim to-neon" style={{ height: `${v * 3}%` }} />
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Top Tenants" subtitle="by usage">
          <ul className="space-y-3 font-mono text-sm">
            {[
              ["Orion Security", "$24,180", 92],
              ["Helios Bank",    "$18,920", 78],
              ["Vega Labs",      "$14,402", 64],
              ["Nimbus Corp",    "$11,140", 51],
              ["Atlas Group",    "$8,860",  38],
            ].map(([name, rev, pct]) => (
              <li key={name as string} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{name}</span>
                  <span className="text-neon">{rev}</span>
                </div>
                <div className="h-1.5 rounded bg-white/5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-neon-dim to-neon"
                    style={{ width: `${pct}%`, boxShadow: "0 0 8px oklch(0.75 0.18 230 / 50%)" }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Job Queue" subtitle="redis · live">
          <div className="mb-3 flex items-center gap-4 font-mono text-sm">
            <div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Queued</div>
              <div className="text-2xl neon-text">{w.queued}</div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Failed</div>
              <div className="text-2xl text-destructive">{w.failed}</div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Retry</div>
              <div className="text-2xl text-warning">{w.retry}</div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Ok</div>
              <div className="text-2xl text-success">{w.ok.toLocaleString()}</div>
            </div>
          </div>
          <div className="h-2 rounded bg-white/5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-success to-neon"
              style={{ width: `${Math.round((w.ok / w.total) * 100)}%` }} />
          </div>
          <div className="mt-1 text-[11px] font-mono text-muted-foreground text-right">
            {Math.round((w.ok / w.total) * 100)}% success rate
          </div>
        </Panel>
      </div>
    </>
  );
}
