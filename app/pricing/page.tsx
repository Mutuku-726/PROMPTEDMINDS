export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-400">
            Choose Your PromptedMinds Plan
          </h1>

          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Start with the tools you need today and upgrade as your marketing
            operation grows.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {/* Free */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">Free</h2>

            <p className="mt-2 text-slate-400">
              Explore PromptedMinds and start building your marketing system.
            </p>

            <div className="mt-6 text-4xl font-bold">
              KES 0
            </div>

            <p className="mt-1 text-slate-500">
              Forever
            </p>

            <ul className="mt-6 space-y-3 text-slate-300">
              <li>✓ 50 AI actions / month</li>
              <li>✓ AI Captions</li>
              <li>✓ AI Ads</li>
              <li>✓ Lead Management</li>
              <li>✓ Marketing Analytics</li>
            </ul>

            <button
              disabled
              className="mt-8 w-full rounded-lg bg-slate-800 px-4 py-3 text-slate-400"
            >
              Current Plan
            </button>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border border-blue-500 bg-slate-900 p-6">
            <div className="inline-block rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold">
              Popular
            </div>

            <h2 className="mt-4 text-2xl font-bold">Pro</h2>

            <p className="mt-2 text-slate-400">
              More AI power for businesses actively growing their marketing.
            </p>

            <div className="mt-6 text-4xl font-bold">
              KES 2,500
            </div>

            <p className="mt-1 text-slate-500">
              / month
            </p>

            <ul className="mt-6 space-y-3 text-slate-300">
              <li>✓ 500 AI actions / month</li>
              <li>✓ AI Captions</li>
              <li>✓ AI Ads</li>
              <li>✓ Lead Management</li>
              <li>✓ Marketing Analytics</li>
              <li>✓ Advanced AI Preferences</li>
            </ul>

            <button
              className="mt-8 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-500 transition"
            >
              Upgrade to Pro
            </button>
          </div>

          {/* Business */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">Business</h2>

            <p className="mt-2 text-slate-400">
              Built for teams managing multiple marketing operations.
            </p>

            <div className="mt-6 text-4xl font-bold">
              KES 7,500
            </div>

            <p className="mt-1 text-slate-500">
              / month
            </p>

            <ul className="mt-6 space-y-3 text-slate-300">
              <li>✓ 2,000 AI actions / month</li>
              <li>✓ Everything in Pro</li>
              <li>✓ Team workspace</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Priority support</li>
            </ul>

            <button
              className="mt-8 w-full rounded-lg bg-slate-800 px-4 py-3 font-semibold hover:bg-slate-700 transition"
            >
              Choose Business
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}