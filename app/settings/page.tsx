"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [defaultPlatform, setDefaultPlatform] = useState("Instagram");
  const [creativeMode, setCreativeMode] = useState(true);
const [seoOptimization, setSeoOptimization] = useState(true);
const [businessFocusedCopy, setBusinessFocusedCopy] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Unable to load your account.");
      setLoading(false);
      return;
    }

    setEmail(user.email ?? "");

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
     .select(
  "full_name, business_name, default_platform, creative_mode, seo_optimization, business_focused_copy"
)
      .eq("id", user.id)
      .maybeSingle();

  if (profileError) {
  setError(profileError.message);
} else if (profile) {
  setFullName(profile.full_name ?? "");
  setBusinessName(profile.business_name ?? "");
  setDefaultPlatform(profile.default_platform ?? "Instagram");

  setCreativeMode(profile.creative_mode ?? true);
  setSeoOptimization(profile.seo_optimization ?? true);
  setBusinessFocusedCopy(profile.business_focused_copy ?? true);
}
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("You must be logged in to save your profile.");
      setSaving(false);
      return;
    }

const { error: updateError } = await supabase
  .from("profiles")
  .update({
    full_name: fullName,
    business_name: businessName,
    default_platform: defaultPlatform,
    creative_mode: creativeMode,
    seo_optimization: seoOptimization,
    business_focused_copy: businessFocusedCopy,
    updated_at: new Date().toISOString(),
  })
  .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage("Profile updated successfully! ✅");
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      <main className="flex-1 p-10">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-blue-400">
              Settings
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your PromptedMinds workspace and preferences.
            </p>
          </div>

          {/* Account */}
          <section className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold">
              Account
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Your PromptedMinds account information.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  disabled={loading}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                />
              </div>

            </div>
          </section>

          {/* Workspace */}
          <section className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold">
              Workspace
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Configure how your marketing workspace works.
            </p>

            <div className="mt-6">
              <label className="block text-sm text-slate-400 mb-2">
                Business Name
              </label>

              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter your business name"
                disabled={loading}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm text-slate-400 mb-2">
                Default Marketing Platform
              </label>

              <select
                value={defaultPlatform}
                onChange={(e) => setDefaultPlatform(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="TikTok">TikTok</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="X">X</option>
              </select>
            </div>

            {/* Save Profile */}
            <div className="mt-6">
              <button
                onClick={handleSaveProfile}
                disabled={saving || loading}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-medium transition"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {message && (
              <div className="mt-4 bg-green-900/30 border border-green-700 text-green-300 rounded-xl p-4 text-sm">
                {message}
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-900/30 border border-red-700 text-red-300 rounded-xl p-4 text-sm">
                {error}
              </div>
            )}
          </section>

          {/* AI Preferences */}
          <section className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold">
              🤖 AI Preferences
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Choose how PromptedMinds should generate marketing content.
            </p>

            <div className="mt-6 space-y-5">

              <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4">
                <div>
                  <p className="font-medium">
                    Creative Mode
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    Generate more creative and attention-grabbing ideas.
                  </p>
                </div>

<button
  type="button"
  onClick={() => setCreativeMode(!creativeMode)}
  className={`w-11 h-6 rounded-full relative transition ${
    creativeMode ? "bg-blue-600" : "bg-slate-600"
  }`}
>
  <div
    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition ${
      creativeMode ? "right-0.5" : "left-0.5"
    }`}
  />
</button>
              </div>

              <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4">
                <div>
                  <p className="font-medium">
                    SEO Optimization
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    Automatically optimize generated content for search.
                  </p>
                </div>

<button
  type="button"
  onClick={() => setSeoOptimization(!seoOptimization)}
  className={`w-11 h-6 rounded-full relative transition ${
    seoOptimization ? "bg-blue-600" : "bg-slate-600"
  }`}
>
  <div
    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition ${
      seoOptimization ? "right-0.5" : "left-0.5"
    }`}
  />
</button>
</div>


              <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4">
                <div>
                  <p className="font-medium">
                    Business-Focused Copy
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    Prioritize conversions, leads, and revenue.
                  </p>
                </div>

<button
  type="button"
  onClick={() => setBusinessFocusedCopy(!businessFocusedCopy)}
  className={`w-11 h-6 rounded-full relative transition ${
    businessFocusedCopy ? "bg-blue-600" : "bg-slate-600"
  }`}
>
  <div
    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition ${
      businessFocusedCopy ? "right-0.5" : "left-0.5"
    }`}
  />
</button>

            </div>
            </div>
          </section>

          {/* Subscription */}
          <section className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold">
              💳 Plan & Usage
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Manage your PromptedMinds subscription and usage.
            </p>

            <div className="mt-6 bg-slate-800 rounded-xl p-5">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Current Plan
                  </p>

                  <p className="text-2xl font-bold mt-1">
                    Free
                  </p>
                </div>

                <button className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl font-medium transition">
                  Upgrade Plan
                </button>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">
                    AI Usage
                  </span>

                  <span>
                    12 / 50
                  </span>
                </div>

                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "24%" }}
                  />
                </div>
              </div>

            </div>
          </section>

          {/* Danger Zone */}
          <section className="mt-6 mb-10 bg-slate-900 border border-red-900/50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-red-400">
              Danger Zone
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Actions in this section can affect your workspace.
            </p>

            <button className="mt-6 border border-red-700 text-red-400 hover:bg-red-900/20 px-5 py-3 rounded-xl transition">
              Delete Workspace
            </button>
          </section>

        </div>
      </main>
    </div>
  );
}