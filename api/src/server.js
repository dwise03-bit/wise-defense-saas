const express = require("express");
const { execSync } = require("child_process");
const os = require("os");
const net = require("net");

const app = express();
app.use(express.json());

const COMPANY_ID = "c8fdae25-59d3-475c-9342-b3f1b0ea230c";

// ── helpers ────────────────────────────────────────────────────────────────────

function cpuPercent() {
  const cpus = os.cpus();
  let user = 0, nice = 0, sys = 0, idle = 0, irq = 0;
  for (const c of cpus) {
    user += c.times.user; nice += c.times.nice;
    sys  += c.times.sys;  idle += c.times.idle; irq += c.times.irq;
  }
  const total = user + nice + sys + idle + irq;
  return Math.round(((total - idle) / total) * 100);
}

function tcpReachable(host, port, ms = 1500) {
  return new Promise((resolve) => {
    const s = new net.Socket();
    s.setTimeout(ms);
    s.connect(port, host, () => { s.destroy(); resolve(true); });
    s.on("error",   () => { s.destroy(); resolve(false); });
    s.on("timeout", () => { s.destroy(); resolve(false); });
  });
}

async function aiStatus() {
  try {
    const r = await fetch("http://host.docker.internal:11434/api/tags",
      { signal: AbortSignal.timeout(2000) });
    return r.ok ? "online" : "offline";
  } catch { return "offline"; }
}

function shell(cmd, opts = {}) {
  return execSync(cmd, { encoding: "utf8", timeout: 10000, ...opts }).trim();
}

// ── GET /metrics ───────────────────────────────────────────────────────────────
app.get("/metrics", async (req, res) => {
  try {
    const ram        = parseInt(shell("free | grep Mem | awk '{printf(\"%.0f\", $3/$2 * 100.0)}'"));
    const disk       = parseInt(shell("df / | tail -1 | awk '{print $5}' | tr -d '%'"));
    const containers = parseInt(shell("docker ps -q | wc -l"));
    const cpu        = cpuPercent();

    const [ai, dbUp, redisUp] = await Promise.all([
      aiStatus(),
      tcpReachable("db",    5432),
      tcpReachable("redis", 6379),
    ]);

    res.json({
      server: "online",
      containers,
      cpu,
      ram,
      disk,
      ai,
      database: { status: dbUp    ? "online" : "offline", latencyMs: 0, connections: 0 },
      redis:    { status: redisUp ? "online" : "offline", opsPerSec: 0, memoryMb: 0 },
      worker:   { status: "online", active: 0, queued: 0 },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /services ──────────────────────────────────────────────────────────────
app.get("/services", (req, res) => {
  try {
    const psLines = shell("docker ps -a --format '{{json .}}'").split("\n").filter(Boolean);
    const containers = psLines.map(l => JSON.parse(l));

    let statsMap = {};
    try {
      const statLines = shell("docker stats --no-stream --format '{{json .}}'").split("\n").filter(Boolean);
      statLines.forEach(l => {
        const s = JSON.parse(l);
        statsMap[s.Name] = s;
      });
    } catch {}

    const services = containers.map(c => {
      const name  = c.Names;
      const stats = statsMap[name] || {};
      const cpu   = stats.CPUPerc ? parseFloat(stats.CPUPerc) : 0;
      const mem   = stats.MemUsage ? stats.MemUsage.split(" / ")[0] : "—";

      let status = "stopped";
      if (c.State === "running")       status = "running";
      else if (c.State !== "exited")   status = "degraded";

      return {
        id:     name,
        name,
        image:  c.Image,
        status,
        uptime: c.RunningFor || "—",
        cpu:    Math.round(cpu * 10) / 10,
        mem,
      };
    });

    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /services/:name/restart ───────────────────────────────────────────────
app.post("/services/:name/restart", (req, res) => {
  const name = req.params.name;
  try {
    shell(`docker restart ${name}`);
    res.json({ ok: true, message: `${name} restarted` });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── GET /services/:name/logs ───────────────────────────────────────────────────
app.get("/services/:name/logs", (req, res) => {
  try {
    const logs = shell(`docker logs --tail 100 --timestamps ${req.params.name} 2>&1`);
    res.type("text/plain").send(logs);
  } catch (err) {
    res.type("text/plain").send(`Error fetching logs: ${err.message}`);
  }
});

// ── GET /events ────────────────────────────────────────────────────────────────
app.get("/events", (req, res) => {
  try {
    const since = Math.floor(Date.now() / 1000) - 3600;
    const until = Math.floor(Date.now() / 1000);
    const raw = shell(
      `docker events --since ${since} --until ${until} --filter 'type=container' --format '{{json .}}'`,
      { timeout: 4000 }
    );

    const events = raw.split("\n").filter(Boolean).map(l => {
      const e = JSON.parse(l);
      const action = e.Action;
      const level  = ["start", "restart"].includes(action) ? "ok"
                   : ["die",   "kill",   "oom"].includes(action) ? "err"
                   : "warn";
      return {
        time:   new Date(e.time * 1000).toISOString().slice(11, 19),
        event:  `${e.Actor?.Attributes?.name || "—"}.${action}`,
        level,
        meta:   e.Actor?.Attributes?.name || e.id?.slice(0, 12),
      };
    }).reverse().slice(0, 8);

    res.json(events);
  } catch {
    res.json([]);
  }
});

// ── GET /business ──────────────────────────────────────────────────────────────
app.get("/business", async (req, res) => {
  let workerQueued = 0;
  try {
    const q = shell("docker exec wise-defense-saas-redis-1 redis-cli LLEN jobs 2>/dev/null || echo 0");
    workerQueued = parseInt(q) || 0;
  } catch {}

  res.json({
    revenue:  { mtd: 184230,  changePct: 12.4 },
    tenants:  { total: 1284,  weeklyNew: 42 },
    apiUsage: { daily: "8.4M", errorPct: 0.12 },
    worker:   { total: 3124,  ok: 2948, retry: 142, failed: 34, queued: workerQueued },
  });
});

// ── POST /ops/:kind ────────────────────────────────────────────────────────────
app.post("/ops/:kind", (req, res) => {
  const { kind }   = req.params;
  const { target } = req.body || {};

  if (kind === "health") {
    try {
      const rows = shell("docker ps --format '{{.Names}}\\t{{.Status}}'")
        .split("\n").filter(Boolean)
        .map(r => { const [name, ...rest] = r.split("\t"); return { name, status: rest.join("\t") }; });
      return res.json({ ok: true, containers: rows });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  if (kind === "deploy" || kind === "rollback") {
    return res.json({ ok: true, message: `${kind} queued for ${target || "all services"}` });
  }

  res.status(400).json({ error: "Unknown operation" });
});

// ── POST /ai/chat ──────────────────────────────────────────────────────────────
app.post("/ai/chat", async (req, res) => {
  const { provider = "Auto", messages = [] } = req.body || {};
  const useProvider = provider === "Auto" ? "Hermes" : provider;

  try {
    if (useProvider === "Claude") {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) return res.status(400).json({ error: "ANTHROPIC_API_KEY not set" });

      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          system: "You are an AI operator for Wise Defense Command Center. Be concise and professional.",
          messages: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await r.json();
      return res.json({ content: data?.content?.[0]?.text || "No response", provider: "Claude" });
    }

    // Default: Hermes via Ollama
    const r = await fetch("http://host.docker.internal:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "hermes3:8b",
        stream: false,
        messages: [
          { role: "system", content: "You are Hermes, the Wise Defense Operations AI. Be concise and professional." },
          ...messages.map(m => ({ role: m.role, content: m.content })),
        ],
      }),
    });
    const data = await r.json();
    return res.json({ content: data?.message?.content || data?.response || "No response", provider: "Hermes" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── legacy ─────────────────────────────────────────────────────────────────────
app.get("/",       (req, res) => res.json({ status: "Wise Defense SaaS Running" }));
app.get("/health", (req, res) => res.json({ status: "ok", service: "api", uptime: process.uptime(), timestamp: new Date().toISOString() }));

app.get("/api/paperclip", (req, res) => {
  try {
    const output = execSync(`npx paperclipai dashboard get -C ${COMPANY_ID} --json`, { encoding: "utf8" });
    res.json(JSON.parse(output));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, "0.0.0.0", () => console.log("API running on port 3000"));
