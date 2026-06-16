"use client";

import { useEffect, useState } from "react";

type DropshipData = {
  latest: Record<string, any>;
  candidate: Record<string, any>;
  margin: number | null;
  error?: string;
};

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("Hermes Ready");
  const [status, setStatus] = useState<any>({});
  const [containers, setContainers] = useState<string[]>([]);
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropship, setDropship] = useState<DropshipData | null>(null);

  async function loadAll() {
    try {
      const s = await fetch("/api/status").then(r => r.json());
      setStatus(s);

      const c = await fetch("/api/containers").then(r => r.json());
      setContainers(c.containers || []);

      const l = await fetch("/api/logs").then(r => r.json());
      setLogs(l.logs || "");

      const d = await fetch("/api/dropship").then(r => r.json());
      setDropship(d);
    } catch {}
  }

  useEffect(() => {
    loadAll();
    const timer = setInterval(loadAll, 5000);
    return () => clearInterval(timer);
  }, []);

  async function askHermes() {
    setLoading(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await r.json();
      setResponse(data.response);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "30px",
        maxWidth: "1600px",
        margin: "0 auto"
      }}
    >
      <div
        className="wise-card"
        style={{
          padding: "30px",
          marginBottom: "25px"
        }}
      >
        <h1 className="wise-heading">
          WISE² COMMAND CENTER
        </h1>

        <p style={{ color: "#AEB7C2" }}>
          Wise Defense Platform • Security Operations Center
        </p>
      </div>

      <h2 className="wise-heading">
        System Health
      </h2>
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "10px",
    marginBottom: "15px"
  }}
>
  <button className="wise-button"
    onClick={() => setPrompt("Review the current Wise Defense system status and identify any risks, bottlenecks, disk issues, memory pressure, container failures, or security concerns. Prioritize findings.")}>
    🩺 Audit System
  </button>

  <button className="wise-button"
    onClick={() => setPrompt("Summarize the current Wise Defense infrastructure, running services, and overall operational status in a concise report.")}>
    📊 Infrastructure Summary
  </button>

  <button className="wise-button"
    onClick={() => setPrompt("Analyze the current system state and explain potential causes if a service is slow, unavailable, or behaving unexpectedly.")}>
    🔍 Diagnose Issue
  </button>

  <button className="wise-button"
    onClick={() => setPrompt("Review the latest logs and explain any warnings, errors, failures, or unusual patterns.")}>
    📜 Analyze Logs
  </button>

  <button className="wise-button"
    onClick={() => setPrompt("Based on the current Wise Defense environment, recommend the highest-value next actions for reliability, scalability, automation, and monetization.")}>
    🚀 Recommend Next Actions
  </button>
</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "16px",
          marginBottom: "30px"
        }}
      >
        {Object.entries(status).map(([k, v]) => (
          <div
            key={k}
            className="wise-card"
            style={{ padding: "20px" }}
          >
            <div
              style={{
                color: "#AEB7C2",
                fontSize: "12px"
              }}
            >
              {k.toUpperCase()}
            </div>

            <div
              style={{
                marginTop: "10px",
                color:
                  String(v) === "online"
                    ? "#00FF9C"
                    : "#ff4d4d",
                fontWeight: "bold"
              }}
            >
              ● {String(v).toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      <h2 className="wise-heading">
        Infrastructure
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: "16px",
          marginBottom: "30px"
        }}
      >
        {containers.map((container) => (
          <div
            key={container}
            className="wise-card"
            style={{
              padding: "18px"
            }}
          >
            <div
              style={{
                color: "#00AEEF",
                marginBottom: "8px"
              }}
            >
              ● RUNNING
            </div>

            <div>{container}</div>
          </div>
        ))}
      </div>

      {/* ── Dropship Factory ─────────────────────────────────────────────── */}
      <h2 className="wise-heading">Dropship Factory</h2>

      {dropship?.error ? (
        <div className="wise-card" style={{ padding: "20px", marginBottom: "30px", color: "#ff4d4d" }}>
          Factory offline — {dropship.error}
        </div>
      ) : dropship ? (
        <div style={{ marginBottom: "30px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "12px", marginBottom: "16px" }}>
            <div className="wise-card" style={{ padding: "20px" }}>
              <div style={{ color: "#AEB7C2", fontSize: "12px" }}>PRODUCT</div>
              <div style={{ marginTop: "8px", fontWeight: "bold", color: "#00AEEF" }}>
                {dropship.latest?.title || dropship.latest?.name || "—"}
              </div>
            </div>
            <div className="wise-card" style={{ padding: "20px" }}>
              <div style={{ color: "#AEB7C2", fontSize: "12px" }}>SOURCE COST</div>
              <div style={{ marginTop: "8px", fontWeight: "bold", color: "#00FF9C" }}>
                ${dropship.latest?.sourceCost ?? "—"}
              </div>
            </div>
            <div className="wise-card" style={{ padding: "20px" }}>
              <div style={{ color: "#AEB7C2", fontSize: "12px" }}>RETAIL PRICE</div>
              <div style={{ marginTop: "8px", fontWeight: "bold", color: "#00FF9C" }}>
                ${dropship.latest?.targetRetail ?? "—"}
              </div>
            </div>
            <div className="wise-card" style={{ padding: "20px" }}>
              <div style={{ color: "#AEB7C2", fontSize: "12px" }}>MARGIN</div>
              <div style={{ marginTop: "8px", fontWeight: "bold", color: dropship.margin !== null && dropship.margin >= 40 ? "#00FF9C" : "#FFD700" }}>
                {dropship.margin !== null ? `${dropship.margin}%` : "—"}
              </div>
            </div>
            <div className="wise-card" style={{ padding: "20px" }}>
              <div style={{ color: "#AEB7C2", fontSize: "12px" }}>CANDIDATE</div>
              <div style={{ marginTop: "8px", fontWeight: "bold", color: "#AEB7C2" }}>
                {dropship.candidate?.title || dropship.candidate?.name || "—"}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "10px" }}>
            <button className="wise-button"
              onClick={() => setPrompt(`Analyze this dropship product and score its potential: ${JSON.stringify(dropship.latest)}. Consider margin, market demand, competition, and scalability.`)}>
              🔬 Analyze Product
            </button>
            <button className="wise-button"
              onClick={() => setPrompt(`Write 3 high-converting product listing titles and a description for: ${dropship.latest?.title || dropship.latest?.name}. Target: Shopify / TikTok Shop.`)}>
              ✍️ Write Listing
            </button>
            <button className="wise-button"
              onClick={() => setPrompt(`Suggest 5 winning dropship products to test this week based on current trends, margin potential, and low competition. Include estimated margins.`)}>
              💡 Find Winners
            </button>
            <button className="wise-button"
              onClick={() => setPrompt(`Compare the current product and candidate: ${JSON.stringify({ current: dropship.latest, candidate: dropship.candidate })}. Which should we prioritize and why?`)}>
              ⚖️ Compare Products
            </button>
          </div>
        </div>
      ) : (
        <div className="wise-card" style={{ padding: "20px", marginBottom: "30px", color: "#AEB7C2" }}>
          Loading factory data…
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(500px,1fr))",
          gap: "20px"
        }}
      >
        <div
          className="wise-card"
          style={{ padding: "24px" }}
        >
          <h2 className="wise-heading">
            Hermes AI
          </h2>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Hermes..."
          />

          <div style={{ marginTop: "15px" }}>
            <button
              className="wise-button"
              onClick={askHermes}
            >
              Send
            </button>
          </div>

          <pre
            style={{
              marginTop: "20px",
              whiteSpace: "pre-wrap"
            }}
          >
            {response}
          </pre>
        </div>

        <div
          className="wise-card"
          style={{ padding: "24px" }}
        >
          <h2 className="wise-heading">
            Live Logs
          </h2>

          <pre
            className="logs"
            style={{
              maxHeight: "500px",
              overflow: "auto"
            }}
          >
            {logs}
          </pre>
        </div>
      </div>
    </main>
  );
}
