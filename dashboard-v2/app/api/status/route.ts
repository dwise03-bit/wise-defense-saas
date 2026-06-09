import { execSync } from "child_process";

function check(cmd: string) {
  try {
    execSync(cmd, { stdio: "ignore" });
    return "online";
  } catch {
    return "offline";
  }
}

export async function GET() {
  return Response.json({
    docker: check("docker ps"),
    postgres: check("docker ps | grep db"),
    redis: check("docker ps | grep redis"),
    api: check("docker ps | grep api"),
    dashboard: check("docker ps | grep dashboard"),
    worker: check("docker ps | grep worker"),
    discord: check("docker ps | grep discord"),
    ollama: check("curl -s http://localhost:11434/api/tags")
  });
}
