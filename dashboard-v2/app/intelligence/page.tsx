"use client";

export default function Intelligence() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "30px",
        maxWidth: "1600px",
        margin: "0 auto"
      }}
    >
      <h1 className="wise-heading">WISE² Intelligence Center</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: "20px",
          marginTop: "25px"
        }}
      >
        <div className="wise-card" style={{ padding: "20px" }}>
          <h2>Hermes AI</h2>
          <p>Local Ollama + Hermes3</p>
          <div style={{ color:"#00FF9C" }}>● ONLINE</div>
        </div>

        <div className="wise-card" style={{ padding: "20px" }}>
          <h2>Discord Bot</h2>
          <p>Command Interface</p>
          <div style={{ color:"#00FF9C" }}>● ONLINE</div>
        </div>

        <div className="wise-card" style={{ padding: "20px" }}>
          <h2>Workers</h2>
          <p>Background Automation Engine</p>
          <div style={{ color:"#00FF9C" }}>● ONLINE</div>
        </div>

        <div className="wise-card" style={{ padding: "20px" }}>
          <h2>Knowledge Base</h2>
          <p>Future RAG / Memory Layer</p>
          <div style={{ color:"#00AEEF" }}>PLANNED</div>
        </div>
      </div>

      <div
        className="wise-card"
        style={{
          padding:"25px",
          marginTop:"30px"
        }}
      >
        <h2>AI Roadmap</h2>

        <ul>
          <li>Hermes Chat Integration</li>
          <li>Discord AI Commands</li>
          <li>Worker Queue Visibility</li>
          <li>Deployment Intelligence</li>
          <li>RAG Knowledge Base</li>
          <li>Multi-Agent System</li>
        </ul>
      </div>
    </main>
  );
}
