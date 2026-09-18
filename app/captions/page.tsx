"use client";

import { useState } from "react";

export default function CaptionsPage() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [caption, setCaption] = useState("");

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold text-blue-400">
          AI Caption Generator
        </h1>

        <p className="mt-2 text-slate-400">
          Create engaging captions for your social media content.
        </p>

        <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <label className="block text-sm font-medium text-slate-300 mb-2">
            What do you want to post about?
          </label>

          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Example: New arrivals at my clothing store..."
            className="w-full min-h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Choose a platform
            </label>

            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500"
            >
              <option>Instagram</option>
              <option>Facebook</option>
              <option>TikTok</option>
              <option>LinkedIn</option>
              <option>X</option>
            </select>
          </div>
<button
  onClick={() => setCaption(`New arrivals are here! Discover our latest collection on ${platform}.`)}
  className="mt-6 w-full bg-blue-600 hover:bg-blue-500 px-6 py-4 rounded-xl font-semibold"
>
  Generate Caption
</button>
{caption && (
  <div className="mt-6 bg-slate-800 p-6 rounded-xl">
    <h2 className="text-xl font-semibold">Generated Caption</h2>
    <p className="mt-3 text-slate-300">{caption}</p>
  </div>
)}
        </div>

      </div>
    </main>
  );
}