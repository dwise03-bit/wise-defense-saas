"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("Hermes Ready");
  const [status, setStatus] = useState<any>({});
  const [containers, setContainers] = useState<string[]>([]);
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadAll() {
    try {
      const s = await fetch("/api/status").then(r => r.json());
      setStatus(s);

      const c = await fetch("/api/containers").then(r => r.json());
      setContainers(c.containers || []);

      const l = await fetch("/api/logs").then(r => r.json());
      setLogs(l.logs || "");
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
