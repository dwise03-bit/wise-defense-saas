import { NextResponse } from "next/server";
import fs from "fs";

const FILE = "./data/provider.json";

export async function GET() {
  try {
    const data = JSON.parse(
      fs.readFileSync(FILE, "utf8")
    );

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      provider: "hermes"
    });
  }
}

export async function POST(req: Request) {
  const body = await req.json();

  fs.writeFileSync(
    FILE,
    JSON.stringify({
      provider: body.provider || "hermes"
    })
  );

  return NextResponse.json({
    success: true,
    provider: body.provider
  });
}
