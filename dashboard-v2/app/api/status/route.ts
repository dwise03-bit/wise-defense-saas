export async function GET() {
  return Response.json({
    dashboard: "online",
    api: "online",
    status: "online"
  });
}
