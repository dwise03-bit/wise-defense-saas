import { execSync } from "child_process";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const provider = process.env.AI_PROVIDER || "hermes";

    const memory = execSync(
      "free | grep Mem | awk '{printf(\"%.0f\", $3/$2 * 100.0)}'"
    ).toString().trim();

    const disk = execSync(
      "df / | tail -1 | awk '{print $5}' | tr -d '%'"
    ).toString().trim();

    const containers = execSync(
      "docker ps -q | wc -l"
    ).toString().trim();

    const uptime = execSync(
      "uptime"
    ).toString().trim();

    const systemContext = `
Live Wise Defense Status

Memory Usage: ${memory}%
Disk Usage: ${disk}%
Running Containers: ${containers}
Uptime: ${uptime}
`;

    if (provider === "claude") {
      const apiKey = process.env.ANTHROPIC_API_KEY;

      if (!apiKey) {
        throw new Error("ANTHROPIC_API_KEY not configured");
      }

      const response = await fetch(
        "https://api.anthropic.com/v1/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01"
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-0",
            max_tokens: 2000,
            messages: [{
              role: "user",
              content: `
${systemContext}

${prompt}
`
            }]
          })
        }
      );

      const data = await response.json();

      return Response.json({
        response: data?.content?.[0]?.text || "No response"
      });
    }

    const response = await fetch(
      "http://10.0.1.1:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "hermes3:8b",
          prompt: `
You are Hermes operating inside the Wise Defense Command Center.

Wise Defense Architecture:
- Docker
- Traefik
- Next.js Dashboard
- Node.js API
- PostgreSQL
- Redis
- Worker Service
- Discord Bot
- Ollama Hermes3:8B
- VPS Infrastructure

${systemContext}

User:
${prompt}
`,
          stream: false
        })
      }
    );

    const data = await response.json();

    return Response.json({
      response: data.response || "No response returned"
    });

  } catch (err: any) {
    return Response.json({
      response: err?.message || "AI error"
    }, { status: 500 });
  }
}
