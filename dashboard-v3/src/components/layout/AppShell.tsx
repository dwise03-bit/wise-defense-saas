import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Server,
  Rocket,
  Brain,
  BarChart3,
  Settings as SettingsIcon,
  Shield,
  Radio,
} from "lucide-react";
import type { ComponentType } from "react";

type NavItem = { to: string; label: string; icon: ComponentType<{ className?: string }> };

const NAV: NavItem[] = [
  { to: "/", label: "Dashboard", icon: Activity },
  { to: "/infrastructure", label: "Infrastructure", icon: Server },
  { to: "/operations", label: "Operations", icon: Rocket },
  { to: "/intelligence", label: "Intelligence", icon: Brain },
  { to: "/business", label: "Business", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="dark min-h-screen text-foreground">
      <div className="grid-bg fixed inset-0 -z-10 opacity-60" />
      <div className="flex min-h-screen">
        <aside className="hidden md:flex w-64 flex-col border-r border-border/60 bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-5 py-5 border-b border-border/60">
            <div className="relative grid place-items-center h-9 w-9 rounded-md neon-border">
              <Shield className="h-4 w-4 text-neon" />
            </div>
            <div className="leading-tight">
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Wise Defense</div>
              <div className="text-sm font-semibold neon-text font-mono">COMMAND CENTER</div>
            </div>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {NAV.map((n) => {
              const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-mono uppercase tracking-wider transition-all ${
                    active
                      ? "bg-primary/10 text-neon neon-border"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{n.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-border/60 text-[10px] font-mono text-muted-foreground space-y-1">
            <div className="flex items-center justify-between">
              <span>SECURE LINK</span>
              <span className="flex items-center gap-1.5 text-success">
                <span className="status-dot pulse-ring bg-success" />
                ONLINE
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>NODE</span>
              <span>VPS-01</span>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 h-14 border-b border-border/60 bg-black/50 backdrop-blur-xl">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <Radio className="h-3.5 w-3.5 text-neon animate-pulse" />
              <span>SOC // {new Date().toUTCString().slice(17, 25)} UTC</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-muted-foreground">THREAT LVL</span>
              <span className="px-2 py-1 rounded neon-border text-neon">LOW</span>
              <span className="hidden sm:flex items-center gap-1.5 text-success">
                <span className="status-dot pulse-ring bg-success" /> ALL SYSTEMS OK
              </span>
            </div>
          </header>
          <main className="flex-1 p-6 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
