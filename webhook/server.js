const express = require("express");
const { execSync } = require("child_process");
const fs = require("fs");

const app = express();
app.use(express.json());

const LOCK_FILE = "/tmp/deploy.lock";
const ACTIVE_FILE = "/home/ubuntu/wise-defense-saas/releases/active";

function run(cmd) {
  return execSync(cmd, { stdio: "inherit" });
}

app.post("/deploy", async (req, res) => {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      return res.status(429).send("Deploy already running");
    }

    fs.writeFileSync(LOCK_FILE, "locked");

    console.log("🚀 Deploy started");

    let prev = "unknown";
    try {
      prev = fs.readFileSync(ACTIVE_FILE, "utf8");
    } catch {}

    console.log("📦 Previous:", prev);

    run("cd ~/wise-defense-saas && git pull");
    run("cd ~/wise-defense-saas && docker compose up -d --build api");

    console.log("🧪 Health check...");
    const result = execSync("curl -fs http://localhost:3000/health || echo FAIL").toString();

    if (!result.includes("ok")) {
      console.log("❌ Failed → rollback");
      run("cd ~/wise-defense-saas && docker compose up -d api");
      fs.unlinkSync(LOCK_FILE);
      return res.status(500).send("Failed + rolled back");
    }

    fs.writeFileSync(ACTIVE_FILE, "latest");

    fs.unlinkSync(LOCK_FILE);
    res.send("Deploy success");
  } catch (err) {
    console.error(err);
    try { fs.unlinkSync(LOCK_FILE); } catch {}
    res.status(500).send("Deploy error");
  }
});

app.listen(4000, "0.0.0.0", () => {
  console.log("🔥 Deploy server running on 4000");
});
app.get("/", (req, res) => {
  res.json({ status: "deploy-engine-online" });
});
