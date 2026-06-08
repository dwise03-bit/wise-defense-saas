const express = require("express");
const { exec } = require("child_process");

const app = express();
app.use(express.json());

const SECRET = "mydeploykey123"; // change this

app.post("/deploy", (req, res) => {
  const token = req.headers["x-deploy-key"];

  if (token !== SECRET) {
    return res.status(403).send("Forbidden");
  }

  console.log("🚀 Deploy triggered");

  exec(`
    cd ~/wise-defense-saas &&
    git pull origin main &&
    docker compose up -d --build
  `, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Deploy failed");
    }

    console.log(stdout);
    res.send("Deploy success");
  });
});

app.listen(9000, () => {
  console.log("CI/CD Webhook running on port 9000");
});
