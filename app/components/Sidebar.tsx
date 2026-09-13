export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-6 text-white">
      <h1 className="text-2xl font-bold text-blue-400">
        PromptedMinds
      </h1>

      <p className="text-slate-400 text-sm mt-1">
        AI Marketing OS
      </p>

      <nav className="mt-10 space-y-4">
        <button className="w-full text-left bg-blue-600 px-4 py-3 rounded-lg">
          📊 Dashboard
        </button>

        <button className="w-full text-left hover:bg-slate-800 px-4 py-3 rounded-lg">
          ✍ AI Captions
        </button>

        <button className="w-full text-left hover:bg-slate-800 px-4 py-3 rounded-lg">
          📢 AI Ads
        </button>

        <button className="w-full text-left hover:bg-slate-800 px-4 py-3 rounded-lg">
          📈 Analytics
        </button>

        <button className="w-full text-left hover:bg-slate-800 px-4 py-3 rounded-lg">
          ⚙ Settings
        </button>
      </nav>
    </aside>
  );
}