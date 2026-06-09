require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { exec } = require("child_process");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

const ADMIN_ID = process.env.ADMIN_ID;

function run(message, cmd) {
  exec(cmd, (err, stdout, stderr) => {
    if (err) return message.reply("❌ Error");
    message.reply("```" + (stdout || stderr || "done").slice(0, 1800) + "```");
  });
}

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.author.id !== ADMIN_ID) return;

  const args = message.content.trim().split(" ");
  const cmd = args[0];

  if (cmd === "!status") return run(message, "docker ps --format 'table {{.Names}}\t{{.Status}}'");
  if (cmd === "!update") return run(message, "wd update");
  if (cmd === "!restart") return run(message, "docker compose restart");
  if (cmd === "!logs") return run(message, `docker compose logs --tail=25 ${args[1] || ""}`);

  message.reply("Commands: !status !update !restart !logs");
});

client.login(process.env.BOT_TOKEN);

client.once("ready", () => {
  console.log("LOGIN SUCCESS:", client.user.tag);
});

client.login(process.env.BOT_TOKEN).catch(console.error);
