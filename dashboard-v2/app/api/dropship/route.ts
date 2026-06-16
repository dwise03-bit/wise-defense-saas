import { execSync } from "child_process";

export async function GET() {
  try {
    const latestRaw = execSync(
      "docker exec dropshipping-factory-factory-ui-1 cat /usr/share/nginx/html/latest.json"
    ).toString();

    const candidateRaw = execSync(
      "docker exec dropshipping-factory-factory-ui-1 cat /usr/share/nginx/html/candidate.json"
    ).toString();

    const latest = JSON.parse(latestRaw);
    const candidate = JSON.parse(candidateRaw);

    const margin = latest.sourceCost && latest.targetRetail
      ? Math.round(((parseFloat(latest.targetRetail) - parseFloat(latest.sourceCost)) / parseFloat(latest.targetRetail)) * 100)
      : null;

    return Response.json({ latest, candidate, margin });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
