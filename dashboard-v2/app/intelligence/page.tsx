"use client";

import { useState } from "react";

export default function Intelligence() {
  const [provider, setProvider] = useState("Claude");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("AI Ready");

  async function askAI() {
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await r.json();
    setResponse(data.response || "No response");
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
      <h1 className="wise-heading">
        WISE² Intelligence Center
      </h1>

      <p style={{ color:"#AEB7C2" }}>
        Multi-Model AI Operations Console
      </p>

      <div
        style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",
          gap:"20px",
          marginTop:"25px"
        }}
      >
        <div className="wise-card" style={{padding:"20px"}}>
          <h2>Claude Sonnet</h2>
          <p>Cloud Intelligence Layer</p>
          <div style={{color:"#00FF9C"}}>● ONLINE</div>
        </div>

        <div className="wise-card" style={{padding:"20px"}}>
          <h2>Hermes 3:8B</h2>
          <p>Local Ollama Model</p>
          <div style={{color:"#00FF9C"}}>● ONLINE</div>
        </div>

        <div className="wise-card" style={{padding:"20px"}}>
          <h2>Discord Bot</h2>
          <p>Command Interface</p>
          <div style={{color:"#00FF9C"}}>● ONLINE</div>
        </div>

        <div className="wise-card" style={{padding:"20px"}}>
          <h2>Workers</h2>
          <p>Automation Engine</p>
          <div style={{color:"#00FF9C"}}>● ONLINE</div>
        </div>
      </div>

      <div
        className="wise-card"
        style={{
          padding:"25px",
          marginTop:"30px"
        }}
      >
        <h2>AI Provider</h2>

        <select
          value={provider}
          onChange={(e)=>setProvider(e.target.value)}
          style={{
            padding:"12px",
            borderRadius:"12px",
            background:"#07111F",
            color:"#EAF7FF",
            border:"1px solid #00AEEF"
          }}
        >
          <option>Claude</option>
          <option>Hermes</option>
          <option>Auto</option>
        </select>

        <p style={{marginTop:"10px",color:"#AEB7C2"}}>
          Active Provider: {provider}
        </p>
      </div>

      <div
        className="wise-card"
        style={{
          padding:"25px",
          marginTop:"30px"
        }}
      >
        <h2>AI Chat</h2>

        <textarea
          value={prompt}
          onChange={(e)=>setPrompt(e.target.value)}
          placeholder="Ask WISE²..."
        />

        <br /><br />

        <button
          className="wise-button"
          onClick={askAI}
        >
          SEND
        </button>

        <pre
          style={{
            marginTop:"20px",
            whiteSpace:"pre-wrap"
          }}
        >
          {response}
        </pre>
      </div>
    </main>
  );
}
