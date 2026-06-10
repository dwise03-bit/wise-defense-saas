import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
  try {
    const logs = execSync(
      "docker logs wise-defense-saas-api-1 --tail 50"
    ).toString();

    return NextResponse.json({ logs });
  } catch (e) {
    return NextResponse.json({
      logs: String(e)
    });
  }
}
