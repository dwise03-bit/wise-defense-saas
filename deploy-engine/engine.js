const crypto = require("crypto");const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
app.use(express.json());

let deploying = false;
let currentVersion = "initial";
let lastGoodVersion = "initial";

function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
      if (err) return reject(stderr || err.message);
      resolve(stdout);
    });
  });
}function verifySignature(req, secret) {
  const signature = req.headers["x-hub-signature-256"];
  if (!signature) return false;

  const hmac = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  const expected = `sha256=${hmac}`;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

async function healthCheck() {
  try {
    const res = await fetch("http://localhost:3000/health");
    const data = await res.json();
    return data.status === "ok";
  } catch {
    return false;
  }
}

async function getGitSha() {
  const sha = await run("cd ~/wise-defense-saas && git rev-parse HEAD");
  return sha.trim();
}

app.post("/deploy", async (req, res) => {
  if (deploying) return res.status(429).json({ error: "deploy in progress" });

  deploying = true;

  try {
    console.log("🚀 V6 DEPLOY START");

    const beforeSha = await getGitSha();

    await run("cd ~/wise-defense-saas && git pull origin main");
    await run("cd ~/wise-defense-saas && docker compose build");
    await run("cd ~/wise-defense-saas && docker compose up -d");

    await new Promise(r => setTimeout(r, 8000));

    const ok = await healthCheck();

    const afterSha = await getGitSha();

    if (!ok) {
      console.log("❌ HEALTH FAIL → ROLLBACK");

      if (lastGoodVersion !== "initial") {
        await run(`cd ~/wise-defense-saas && git checkout ${lastGoodVersion}`);
        await run("cd ~/wise-defense-saas && docker compose up -d --build");
      }

      deploying = false;
      return res.status(500).json({ status: "rollback" });
    }

    lastGoodVersion = afterSha;
    currentVersion = afterSha;

    fs.writeFileSync("./deploy.log", JSON.stringify({
      time: new Date().toISOString(),
      version: afterSha
    }) + "\n", { flag: "a" });

    deploying = false;

    res.json({
      status: "deploy success",
      version: afterSha
    });

  } catch (err) {
    deploying = false;
    console.error(err);
    res.status(500).json({ error: "deploy failed" });
  }
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    deploying,
    currentVersion,
    lastGoodVersion
  });
});

app.listen(4000, () => {
  console.log("🚀 V6 Production Deploy Engine running on :4000");
});
