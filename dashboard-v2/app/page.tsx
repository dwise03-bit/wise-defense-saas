"use client";

import Image from "next/image";

const sections = [
  { title: "Dashboard", href: "/dashboard", desc: "System overview and command center" },
  { title: "Infrastructure", href: "/infrastructure", desc: "Servers, containers, database and network" },
  { title: "Operations", href: "/operations", desc: "Deployments, logs and automation" },
  { title: "Intelligence", href: "/intelligence", desc: "Hermes AI and automation tools" },
  { title: "Business", href: "/business", desc: "Tenants, SaaS operations and growth" },
  { title: "Docs", href: "/docs", desc: "Manuals, architecture and procedures" },
  { title: "Settings", href: "/settings", desc: "System configuration" }
];

const status = [
  { name: "API", state: "ONLINE" },
  { name: "POSTGRES", state: "ONLINE" },
  { name: "REDIS", state: "ONLINE" },
  { name: "WORKERS", state: "ONLINE" },
  { name: "DISCORD BOT", state: "ONLINE" },
  { name: "HERMES AI", state: "READY" }
];

export default function Home() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          overflow: "hidden"
        }}
      >
        <Image
          src="/assets/hero/dashboard-main.png"
          alt="WISE Command Center"
          fill
          priority
          style={{
            objectFit: "cover",
            opacity: 0.45
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(5,7,13,.55), rgba(5,7,13,.95))"
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 5,
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "40px 24px"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "50px"
            }}
          >
            <Image
              src="/assets/logos/wise-defense-logo-primary.png"
              alt="WISE"
              width={90}
              height={90}
            />

            <div>
              <h1 className="wise-heading" style={{ margin: 0, fontSize: "3.5rem" }}>
                WISE² COMMAND CENTER
              </h1>

              <p style={{ color: "#AEB7C2", margin: 0 }}>
                Build. Organize. Scale. Repeat.
              </p>
            </div>
          </div>

          <div
            className="wise-card"
            style={{
              padding: "40px",
              marginBottom: "40px"
            }}
          >
            <h2 className="wise-heading">
              Creator Operating System™
            </h2>

            <p
              style={{
                color: "#AEB7C2",
                maxWidth: "850px",
                lineHeight: 1.8
              }}
            >
              Production-grade infrastructure powered by Docker,
              PostgreSQL, Redis, Workers, Discord automation,
              Traefik routing, and Hermes AI intelligence.
            </p>

            <div style={{ marginTop: "30px" }}>
              <a
                href="/dashboard"
                className="wise-button"
              >
                Enter Command Center
              </a>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: "16px",
              marginBottom: "40px"
            }}
          >
            {status.map((item) => (
              <div
                key={item.name}
                className="wise-card"
                style={{ padding: "20px" }}
              >
                <div style={{ color: "#AEB7C2", fontSize: "12px" }}>
                  {item.name}
                </div>

                <div
                  style={{
                    color: "#00FF9C",
                    fontWeight: "bold",
                    marginTop: "8px"
                  }}
                >
                  ● {item.state}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(260px,1fr))",
              gap: "20px"
            }}
          >
            {sections.map((section) => (
              <a
                key={section.title}
                href={section.href}
                className="wise-card"
                style={{
                  padding: "24px",
                  textDecoration: "none",
                  color: "white"
                }}
              >
                <h3>{section.title}</h3>

                <p style={{ color: "#AEB7C2" }}>
                  {section.desc}
                </p>
              </a>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(420px,1fr))",
              gap: "24px",
              marginTop: "60px"
            }}
          >
            <div className="wise-card" style={{ padding: "15px" }}>
              <Image
                src="/assets/infrastructure/wise-defense-ecosystem.png"
                alt="Infrastructure"
                width={1000}
                height={600}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "18px"
                }}
              />
            </div>

            <div className="wise-card" style={{ padding: "15px" }}>
              <Image
                src="/assets/infrastructure/flow-engine-module.png"
                alt="Flow Engine"
                width={1000}
                height={600}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "18px"
                }}
              />
            </div>
          </div>

          <div
            className="wise-card"
            style={{
              marginTop: "50px",
              padding: "30px",
              display: "flex",
              gap: "24px",
              alignItems: "center",
              flexWrap: "wrap"
            }}
          >
            <Image
              src="/assets/mascot/wise-imp-operator.png"
              alt="WISE IMP"
              width={180}
              height={180}
            />

            <div>
              <h2 className="wise-heading">
                WISE IMP™ AI Co-Pilot
              </h2>

              <p style={{ color: "#AEB7C2" }}>
                Your infrastructure assistant for deployments,
                monitoring, automation, documentation,
                operations, and SaaS growth.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
