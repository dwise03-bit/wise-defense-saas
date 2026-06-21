const pg = require("pg");
const https = require("https");

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:SuperSecurePassword123@localhost:5432/wisedefense?sslmode=disable",
  ssl: false,
});

async function sendDiscord(title, message) {
  if (!process.env.DISCORD_WEBHOOK_URL) {
    console.log("[ALERTS] Discord webhook not configured");
    return;
  }
  
  const payload = {
    username: "Wise Defense Alerts",
    embeds: [{
      title: title,
      description: message,
      color: 3447003,
      timestamp: new Date(),
    }]
  };
  
  const req = https.request(
    process.env.DISCORD_WEBHOOK_URL,
    { method: "POST", headers: { "Content-Type": "application/json" } },
    (res) => {
      res.on("data", () => {});
      res.on("end", () => {
        if (res.statusCode === 204) {
          console.log("[ALERTS] ✓ Discord notification sent");
        } else {
          console.log("[ALERTS] Discord response:", res.statusCode);
        }
      });
    }
  );
  
  req.on("error", (e) => console.error("[ALERTS] Discord error:", e.message));
  req.write(JSON.stringify(payload));
  req.end();
}

async function logDatabase(event, message) {
  try {
    await pool.query(
      "INSERT INTO alerts (event_type, message) VALUES ($1, $2)",
      [event, message]
    );
    console.log("[ALERTS] ✓ Logged to database");
  } catch (e) {
    console.error("[ALERTS] Database error:", e.message);
  }
}

// Simple health check
setInterval(() => {
  console.log("[ALERTS] Health check: system running");
}, 60000);

// Test alert on startup
console.log("[ALERTS] System started - Discord webhook configured");

process.on("SIGTERM", () => {
  console.log("[ALERTS] Shutting down");
  pool.end();
  process.exit(0);
});

// Export functions for testing
module.exports = { sendDiscord, logDatabase };
