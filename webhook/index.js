const express = require("express");
const { exec } = require("child_process");

const app = express();
app.use(express.json());

app.post("/deploy", (req, res) => {
  console.log("🚀 Deploy triggered");

  exec("bash deploy.sh", (err, stdout, stderr) => {
    if (err) console.error(stderr);
    console.log(stdout);
  });

  res.send("Deploy started");
});

app.post("/rollback", (req, res) => {
  console.log("🔄 Rollback triggered");

  exec("bash rollback.sh", (err, stdout, stderr) => {
    if (err) console.error(stderr);
    console.log(stdout);
  });

  res.send("Rollback started");
});

app.listen(4000, () => {
  console.log("Webhook running on port 4000");
});
