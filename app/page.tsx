import Sidebar from "./components/Sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1">
        <header className="border-b border-slate-800 p-6">
          <h1 className="text-3xl font-bold text-blue-400">
            PromptedMinds
          </h1>

          <p className="text-slate-400">
            AI Marketing Operating System
          </p>
        </header>

        <section className="p-10">
          <h2 className="text-4xl font-bold">
            Dashboard
          </h2>

          <p className="mt-2 text-slate-400">
            Welcome back, Eric 👋
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">

            <div className="rounded-xl bg-slate-900 p-6">
              <h3 className="text-xl font-semibold">
                AI Caption Generator
              </h3>

              <p className="mt-2 text-slate-400">
                Generate engaging social media captions.
              </p>
            </div>

            <div className="rounded-xl bg-slate-900 p-6">
              <h3 className="text-xl font-semibold">
                AI Ad Copy
              </h3>

              <p className="mt-2 text-slate-400">
                Create high-converting advertisements.
              </p>
            </div>

            <div className="rounded-xl bg-slate-900 p-6">
              <h3 className="text-xl font-semibold">
                Marketing Strategy
              </h3>

              <p className="mt-2 text-slate-400">
                Build complete marketing plans.
              </p>
            </div>

            <div className="rounded-xl bg-slate-900 p-6">
              <h3 className="text-xl font-semibold">
                Analytics
              </h3>

              <p className="mt-2 text-slate-400">
                Track growth and campaign performance.
              </p>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}