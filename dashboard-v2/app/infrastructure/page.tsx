"use client";

import Image from "next/image";

const services = [
  "Traefik",
  "API",
  "PostgreSQL",
  "Redis",
  "Worker",
  "Discord Bot",
  "Hermes AI"
];

export default function Infrastructure() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "30px",
        maxWidth: "1600px",
        margin: "0 auto"
      }}
    >
      <div className="wise-card" style={{ padding: "30px", marginBottom: "30px" }}>
        <h1 className="wise-heading">
          Infrastructure Command Center
        </h1>

        <p style={{ color: "#AEB7C2" }}>
          Wise Defense SaaS Platform Topology
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px"
        }}
      >
        <div className="wise-card" style={{ padding: "20px" }}>
          <h2 className="wise-heading">
            System Topology
          </h2>

          <Image
            src="/assets/infrastructure/wise-defense-ecosystem.png"
            alt="Infrastructure"
            width={1200}
            height={800}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "18px"
            }}
          />
        </div>

        <div className="wise-card" style={{ padding: "20px" }}>
          <h2 className="wise-heading">
            Server
          </h2>

          <p>IP: 51.81.80.252</p>
          <p>Stack: Docker + Traefik</p>
          <p>Environment: Production</p>

          <div
            style={{
              marginTop: "20px",
              display: "grid",
              gap: "10px"
            }}
          >
            {services.map((service) => (
              <div
                key={service}
                className="wise-card"
                style={{
                  padding: "12px"
                }}
              >
                <span style={{ color: "#00FF9C" }}>
                  ● ONLINE
                </span>

                <div>{service}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="wise-card"
        style={{
          marginTop: "24px",
          padding: "24px"
        }}
      >
        <h2 className="wise-heading">
          Architecture Flow
        </h2>

        <pre
          style={{
            color: "#AEB7C2",
            fontSize: "16px"
          }}
        >
{`Internet
   │
Traefik
   │
API
├── PostgreSQL
├── Redis
├── Worker
└── Discord Bot

Hermes AI`}
        </pre>
      </div>
    </main>
  );
}
