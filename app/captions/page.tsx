"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import { createClient } from "@/lib/supabase/client";

type SavedCaption = {
  id: string;
  topic: string;
  platform: string;
  caption: string;
  created_at: string;
};

const platformOptions = [
  "Instagram",
  "Facebook",
  "TikTok",
  "LinkedIn",
  "X",
];

export default function CaptionsPage() {
  const supabase = createClient();

  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [captions, setCaptions] = useState<SavedCaption[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");

  const [loading, setLoading] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadSavedCaptions = async () => {
      setLoadingSaved(true);
      setError("");

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("You must be logged in to view your captions.");
          setLoadingSaved(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from("captions")
          .select("id, topic, platform, caption, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error("Load captions error:", fetchError);
          setError("Failed to load your saved captions.");
        } else {
          setCaptions(data || []);
        }
      } catch (err) {
        console.error("Load captions error:", err);
        setError("Something went wrong while loading your captions.");
      }

      setLoadingSaved(false);
    };

    loadSavedCaptions();
  }, []);

  const handleGenerateCaption = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic first.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in to generate a caption.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/caption", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          platform,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to generate caption.");
        setLoading(false);
        return;
      }

      const generatedCaption = data.caption;

      if (!generatedCaption) {
        setError("The AI did not return a caption.");
        setLoading(false);
        return;
      }

      const { data: savedCaption, error: saveError } = await supabase
        .from("captions")
        .insert({
          user_id: user.id,
          topic,
          platform,
          caption: generatedCaption,
        })
        .select("id, topic, platform, caption, created_at")
        .single();

      if (saveError) {
        console.error("Save caption error:", saveError);

        setCaptions((prev) => [
          {
            id: `temporary-${Date.now()}`,
            topic,
            platform,
            caption: generatedCaption,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);

        setError(
          "Caption was generated, but it could not be saved to your workspace."
        );
      } else if (savedCaption) {
        setCaptions((prev) => [savedCaption, ...prev]);
        setSuccess("Caption generated and saved successfully! ✅");
      }
    } catch (err) {
      console.error("Caption generation error:", err);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const filteredCaptions = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return captions.filter((item) => {
      const matchesSearch =
        !search ||
        item.topic.toLowerCase().includes(search) ||
        item.caption.toLowerCase().includes(search);

      const matchesPlatform =
        platformFilter === "all" ||
        item.platform === platformFilter;

      return matchesSearch && matchesPlatform;
    });
  }, [captions, searchTerm, platformFilter]);

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 p-10">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <h1 className="text-4xl font-bold text-blue-400">
            AI Caption Generator
          </h1>

          <p className="mt-2 text-slate-400">
            Create engaging captions for your social media content.
          </p>

          {/* Generator */}
          <div className="mt-8">

            <label className="block text-sm font-medium text-slate-300">
              What do you want to post about?
            </label>

            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Example: Promoting my new business"
              className="mt-2 w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />

            <label className="block text-sm font-medium text-slate-300 mt-6">
              Platform
            </label>

            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="mt-2 w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500"
            >
              {platformOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>

            <button
              onClick={handleGenerateCaption}
              disabled={loading}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed px-6 py-4 rounded-xl font-semibold transition"
            >
              {loading ? "Generating..." : "Generate Caption"}
            </button>

            {error && (
              <div className="mt-4 bg-red-900/40 border border-red-700 text-red-200 p-4 rounded-xl">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 bg-green-900/40 border border-green-700 text-green-200 p-4 rounded-xl">
                {success}
              </div>
            )}

          </div>

          {/* Saved Captions */}
          <div className="mt-10">

            <div className="flex items-center justify-between gap-4 mb-4">

              <div>
                <h2 className="text-2xl font-bold">
                  Saved Captions
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  Search and organize your saved content.
                </p>
              </div>

              <span className="text-sm bg-slate-800 px-3 py-2 rounded-lg text-slate-300 whitespace-nowrap">
                {filteredCaptions.length} of {captions.length}
              </span>

            </div>

            {/* Search and Filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

              <div className="md:col-span-2">
                <label className="block text-sm text-slate-400 mb-2">
                  Search captions
                </label>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by topic or caption..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Filter by platform
                </label>

                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Platforms</option>

                  {platformOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {loadingSaved ? (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-slate-400">
                Loading your saved captions...
              </div>
            ) : captions.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-slate-400">
                You don't have any saved captions yet.
              </div>
            ) : filteredCaptions.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-slate-400">
                No captions match your search or filter.
              </div>
            ) : (
              <div className="space-y-4">

                {filteredCaptions.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-900 border border-slate-800 p-6 rounded-xl"
                  >

                    <div className="flex items-center justify-between gap-4">

                      <h3 className="text-lg font-semibold">
                        {item.platform}
                      </h3>

                      <span className="text-xs text-slate-500">
                        {new Date(
                          item.created_at
                        ).toLocaleDateString()}
                      </span>

                    </div>

                    <p className="mt-2 text-sm text-blue-400">
                      {item.topic}
                    </p>

                    <p className="mt-4 text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {item.caption}
                    </p>

                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(item.caption)
                      }
                      className="mt-5 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition"
                    >
                      📋 Copy Caption
                    </button>

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}