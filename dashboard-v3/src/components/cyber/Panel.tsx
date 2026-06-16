import type { ReactNode } from "react";

export function Panel({
  title,
  subtitle,
  right,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`glass glass-hover rounded-lg ${className}`}>
      {(title || right) && (
        <header className="flex items-center justify-between px-5 py-3 border-b border-border/60">
          <div>
            {title && (
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-neon">{title}</h2>
            )}
            {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {right}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatusDot({ tone = "success" }: { tone?: "success" | "warning" | "danger" | "muted" }) {
  const cls = {
    success: "bg-success text-success",
    warning: "bg-warning text-warning",
    danger: "bg-destructive text-destructive",
    muted: "bg-muted-foreground text-muted-foreground",
  }[tone];
  return <span className={`status-dot pulse-ring ${cls}`} />;
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
        // {subtitle ?? "module"}
      </div>
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight neon-text font-mono mt-1">
        {title}
      </h1>
    </div>
  );
}
