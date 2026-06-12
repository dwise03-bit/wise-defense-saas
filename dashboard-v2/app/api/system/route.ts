import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
  try {
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

    return NextResponse.json({
      memory,
      disk,
      containers,
      uptime
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    });
  }
}
