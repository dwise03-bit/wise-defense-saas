export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white p-4">

      <div className="mb-4 rounded-xl border border-blue-500/30 bg-zinc-950 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-blue-400">
              WISE TOUCH
            </h1>

            <p className="text-zinc-400">
              AI COMMAND CENTER
            </p>
          </div>

          <div className="text-green-400 font-bold">
            ● ONLINE
          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 xl:grid-cols-[250px_1fr_300px]">

        {/* Sidebar */}
        <div className="rounded-xl border border-blue-500/30 bg-zinc-950 p-4">

          <div className="space-y-4 text-zinc-300">

            <div>🏠 Dashboard</div>
            <div>🤖 AI Command Center</div>
            <div>📁 Projects</div>
            <div>🚀 Deployments</div>
            <div>🖥 Infrastructure</div>
            <div>👥 Customers</div>
            <div>⚙️ Settings</div>

          </div>

        </div>

        {/* Center */}
        <div className="space-y-4">

          <div className="rounded-xl border border-blue-500/30 bg-zinc-950 p-6">

            <h2 className="text-3xl font-bold text-blue-400">
              AI Terminal
            </h2>

            <div className="mt-6 rounded-lg border border-zinc-800 bg-black p-4 text-zinc-300">
              Yo! I'm ready to help you build, create, and scale.
              <br />
              <br />
              What's the mission today?
            </div>

            <input
              className="mt-4 w-full rounded-lg bg-zinc-900 p-3 outline-none"
              placeholder="Ask Hermes..."
            />

            <button className="mt-4 rounded bg-blue-600 px-6 py-3">
              SEND
            </button>

          </div>

          <div className="rounded-xl border border-blue-500/30 bg-zinc-950 p-6">

            <h3 className="text-xl text-blue-400">
              Quick Actions
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-3">

              <button className="rounded bg-blue-600 p-3">
                Brand Builder
              </button>

              <button className="rounded bg-blue-600 p-3">
                Business Blueprint
              </button>

              <button className="rounded bg-blue-600 p-3">
                Deploy
              </button>

              <button className="rounded bg-blue-600 p-3">
                Infrastructure
              </button>

            </div>

          </div>

        </div>

        {/* Right */}
        <div className="space-y-4">

          <div className="rounded-xl border border-blue-500/30 bg-zinc-950 p-4">

            <h3 className="font-bold text-blue-400">
              System Status
            </h3>

            <div className="mt-4 space-y-2">

              <div>🟢 API</div>
              <div>🟢 PostgreSQL</div>
              <div>🟢 Redis</div>
              <div>🟢 Discord Bot</div>
              <div>🟢 Ollama</div>

            </div>

          </div>

          <div className="rounded-xl border border-blue-500/30 bg-zinc-950 p-4">

            <h3 className="font-bold text-blue-400">
              Recent Projects
            </h3>

            <div className="mt-4 space-y-2">

              <div>Wise Touch V2</div>
              <div>Deploy Engine</div>
              <div>Business Builder</div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
