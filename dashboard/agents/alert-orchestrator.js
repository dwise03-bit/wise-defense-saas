const pg = require("pg");
const http = require("http");
const https = require("https");

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:SuperSecurePassword123@localhost:5432/wisedefense?sslmode=disable",
  ssl: false,
});

class AlertOrchestrator {
  async sendAlert(event, message, metadata = {}) {
    console.log(`[ALERTS] New event: ${event}`);
    
    // Send to all channels in parallel
    await Promise.all([
      this.sendDiscord(event, message, metadata),
      this.sendTelegram(event, message, metadata),
      this.sendEmail(event, message, metadata),
      this.logToDatabase(event, message, metadata),
    ]);
  }

  async sendDiscord(event, message, metadata) {
    try {
      if (!process.env.DISCORD_WEBHOOK_URL) return;
      
      const payload = {
        username: "Wise Defense Pipeline",
        embeds: [{
          title: `📢 ${event}`,
          description: message,
          color: this.getColor(event),
          fields: Object.entries(metadata).map(([k, v]) => ({
            name: k, value: String(v), inline: true
          })),
          timestamp: new Date(),
        }]
      };
      
      const req = https.request(
        process.env.DISCORD_WEBHOOK_URL,
        { method: "POST", headers: { "Content-Type": "application/json" } },
        () => console.log("[ALERTS] Discord: ✓")
      );
      req.write(JSON.stringify(payload));
      req.end();
    } catch (e) {
      console.error("[ALERTS] Discord error:", e.message);
    }
  }

  async sendTelegram(event, message, metadata) {
    try {
      if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHANNEL_ID) return;
      
      const text = `🚀 *${event}*\n\n${message}\n\n${Object.entries(metadata).map(([k,v]) => `_${k}: ${v}_`).join("\n")}`;
      
      const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
      const payload = JSON.stringify({
        chat_id: process.env.TELEGRAM_CHANNEL_ID,
        text: text,
        parse_mode: "Markdown"
      });
      
      const req = https.request(
        url,
        { method: "POST", headers: { "Content-Type": "application/json", "Content-Length": payload.length } },
        () => console.log("[ALERTS] Telegram: ✓")
      );
      req.write(payload);
      req.end();
    } catch (e) {
      console.error("[ALERTS] Telegram error:", e.message);
    }
  }

  async sendEmail(event, message, metadata) {
    try {
      if (!process.env.EMAIL_SERVICE) return;
      console.log("[ALERTS] Email alert queued:", event);
      // Email would use SendGrid, AWS SES, or similar
    } catch (e) {
      console.error("[ALERTS] Email error:", e.message);
    }
  }

  async logToDatabase(event, message, metadata) {
    try {
      await pool.query(
        `INSERT INTO alerts (event_type, message, metadata, created_at) VALUES ($1, $2, $3, NOW())`,
        [event, message, JSON.stringify(metadata)]
      );
      console.log("[ALERTS] Logged to database: ✓");
    } catch (e) {
      console.error("[ALERTS] Database error:", e.message);
    }
  }

  getColor(event) {
    const colors = {
      "Content Submitted": 3447003,
      "Content Reviewed": 3066993,
      "Video Generated": 9699539,
      "Post Published": 2123412,
      "Pipeline Complete": 65280,
      "Error": 15158332,
    };
    return colors[event] || 3447003;
  }
}

const alertor = new AlertOrchestrator();

// Monitor pipeline events every 30 seconds
setInterval(async () => {
  try {
    // Check for new submissions
    const submissions = await pool.query(
      "SELECT id, title FROM news_articles WHERE created_at > NOW() - INTERVAL 30 seconds AND id NOT IN (SELECT article_id FROM content_reviews)"
    );
    for (const article of submissions.rows) {
      await alertor.sendAlert(
        "📝 Content Submitted",
        `New article submitted for review`,
        { "Article ID": article.id, "Title": article.title.substring(0, 50) }
      );
    }

    // Check for new reviews
    const reviews = await pool.query(
      "SELECT a.id, a.title, cr.relevance_score FROM news_articles a JOIN content_reviews cr ON a.id = cr.article_id WHERE cr.created_at > NOW() - INTERVAL 30 seconds"
    );
    for (const review of reviews.rows) {
      await alertor.sendAlert(
        "🔍 Content Reviewed",
        `Article reviewed and prioritized`,
        { "Article ID": review.id, "Relevance": review.relevance_score }
      );
    }

    // Check for published posts
    const posts = await pool.query(
      "SELECT id, platform FROM social_posts_generated WHERE status = posted AND posted_at > NOW() - INTERVAL 30 seconds"
    );
    for (const post of posts.rows) {
      await alertor.sendAlert(
        "📱 Post Published",
        `Content published to ${post.platform}`,
        { "Post ID": post.id, "Platform": post.platform }
      );
    }

    // Check for uploaded videos
    const videos = await pool.query(
      "SELECT id, title, youtube_url FROM youtube_videos WHERE status = uploaded AND uploaded_at > NOW() - INTERVAL 30 seconds"
    );
    for (const video of videos.rows) {
      await alertor.sendAlert(
        "🎥 Video Uploaded",
        `New video published to YouTube`,
        { "Video ID": video.id, "Title": video.title.substring(0, 50), "URL": video.youtube_url }
      );
    }
  } catch (error) {
    console.error("[ALERTS] Monitor error:", error.message);
  }
}, 30000);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("[ALERTS] Shutting down");
  pool.end();
  process.exit(0);
});

console.log("[ALERTS] Alert Orchestrator started - monitoring all channels");
