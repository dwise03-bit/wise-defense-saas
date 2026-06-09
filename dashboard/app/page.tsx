export default function Home() {
  return (
    <main style={{
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      background: "#111",
      color: "#fff",
      minHeight: "100vh"
    }}>
      <h1>🛡️ Wise Defense SaaS</h1>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:"20px",marginTop:"20px"}}>

        <div style={{padding:"20px",border:"1px solid #333",borderRadius:"10px"}}>
          <h2>API</h2>
          <p>✅ Online</p>
        </div>

        <div style={{padding:"20px",border:"1px solid #333",borderRadius:"10px"}}>
          <h2>Database</h2>
          <p>✅ PostgreSQL Running</p>
        </div>

        <div style={{padding:"20px",border:"1px solid #333",borderRadius:"10px"}}>
          <h2>Redis</h2>
          <p>✅ Online</p>
        </div>

        <div style={{padding:"20px",border:"1px solid #333",borderRadius:"10px"}}>
          <h2>Discord Bot</h2>
          <p>✅ Connected</p>
        </div>

      </div>

      <div style={{marginTop:"30px"}}>
        <h2>Server</h2>
        <p>IP: 51.81.80.252</p>
        <p>Status: Operational</p>
      </div>
    </main>
  );
}
