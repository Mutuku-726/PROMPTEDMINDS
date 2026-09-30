"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "../components/Sidebar";

type SavedCampaign = {
  id: string;
  business_name: string;
  product: string;
  target_audience: string;
  campaign_goal: string;
  campaign_content: string | null;
  created_at: string;
};

export default function AdsPage() {
  const supabase = createClient();

  const [business, setBusiness] = useState("");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("");

  const [campaign, setCampaign] = useState("");
  const [savedCampaigns, setSavedCampaigns] = useState<SavedCampaign[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load saved campaigns when the page opens
  useEffect(() => {
    const loadSavedCampaigns = async () => {
      setLoadingSaved(true);
      setError("");

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("You must be logged in to view your campaigns.");
          setLoadingSaved(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from("ad_campaigns")
          .select(
            "id, business_name, product, target_audience, campaign_goal, campaign_content, created_at"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error("Load campaigns error:", fetchError);
          setError("Failed to load your saved campaigns.");
        } else {
          setSavedCampaigns(data || []);
        }
      } catch (err) {
        console.error("Load campaigns error:", err);
        setError("Something went wrong while loading your campaigns.");
      }

      setLoadingSaved(false);
    };

    loadSavedCampaigns();
  }, []);

  const handleBuildCampaign = async () => {
    if (!business.trim() || !product.trim() || !audience.trim() || !goal.trim()) {
      setError("Please complete all campaign fields first.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setCampaign("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in to create a campaign.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business,
          product,
          audience,
          goal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to generate campaign.");
        setLoading(false);
        return;
      }

      const generatedCampaign = data.campaign;

      setCampaign(generatedCampaign);

      // Save campaign to Supabase
      const { data: savedCampaign, error: saveError } = await supabase
        .from("ad_campaigns")
        .insert({
          user_id: user.id,
          business_name: business,
          product: product,
          target_audience: audience,
          campaign_goal: goal,
          campaign_content: generatedCampaign,
        })
        .select(
          "id, business_name, product, target_audience, campaign_goal, campaign_content, created_at"
        )
        .single();

      if (saveError) {
        console.error("Save campaign error:", saveError);

        setError(
          "Campaign was generated, but it could not be saved to your workspace."
        );
      } else if (savedCampaign) {
        setSavedCampaigns((prev) => [savedCampaign, ...prev]);
        setSuccess("Campaign generated and saved successfully! ✅");
      }
    } catch (err) {
      console.error("Campaign generation error:", err);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
  <div className="flex min-h-screen bg-slate-950 text-white">
  <Sidebar />
  <main className="flex-1 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            📢 AI Ads
          </h1>

          <p className="text-slate-400 mt-2">
            Build practical advertising campaigns powered by AI.
          </p>
        </div>

        {/* Campaign Builder */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <div className="grid md:grid-cols-2 gap-6">

            {/* Business */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Business Name
              </label>

              <input
                type="text"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                placeholder="e.g. Top Ten Tyres"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Product */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Product / Service
              </label>

              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g. Premium tyres and wheel alignment"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Audience */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Target Audience
              </label>

              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Car owners in Nairobi"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Goal */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Campaign Goal
              </label>

              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Generate more WhatsApp enquiries"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

          </div>

          {/* Errors */}
          {error && (
            <div className="mt-6 bg-red-900/40 border border-red-700 text-red-200 p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mt-6 bg-green-900/40 border border-green-700 text-green-200 p-4 rounded-lg">
              {success}
            </div>
          )}

          {/* Generate */}
          <button
            onClick={handleBuildCampaign}
            disabled={loading}
            className="mt-8 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed py-4 rounded-lg font-semibold transition"
          >
            {loading ? "Building Campaign..." : "🚀 Build Campaign"}
          </button>
        </div>

        {/* Current Campaign */}
        {campaign && (
          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <h2 className="text-2xl font-bold mb-6">
              Your AI Campaign
            </h2>

            <div className="bg-slate-800 rounded-xl p-6 whitespace-pre-wrap text-slate-200 leading-relaxed">
              {campaign}
            </div>

          </div>
        )}

        {/* Saved Campaigns */}
        <div className="mt-10">

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              Saved Campaigns
            </h2>

            <span className="text-sm text-slate-500">
              {savedCampaigns.length} saved
            </span>
          </div>

          {loadingSaved ? (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-slate-400">
              Loading your saved campaigns...
            </div>
          ) : savedCampaigns.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-slate-400">
              You don't have any saved campaigns yet.
            </div>
          ) : (
            <div className="space-y-4">

              {savedCampaigns.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 p-6 rounded-xl"
                >

                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold">
                      {item.business_name}
                    </h3>

                    <span className="text-xs text-slate-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="mt-2 text-blue-400">
                    {item.product}
                  </p>

                  <div className="mt-4 grid md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-slate-800 rounded-lg p-3">
                      <span className="text-slate-500">
                        Audience
                      </span>

                      <p className="text-slate-300 mt-1">
                        {item.target_audience}
                      </p>
                    </div>

                    <div className="bg-slate-800 rounded-lg p-3">
                      <span className="text-slate-500">
                        Goal
                      </span>

                      <p className="text-slate-300 mt-1">
                        {item.campaign_goal}
                      </p>
                    </div>
                  </div>

                  {item.campaign_content && (
                    <div className="mt-4">
                      <p className="text-sm text-slate-500 mb-2">
                        Campaign Strategy
                      </p>

                      <div className="bg-slate-800 rounded-xl p-5 whitespace-pre-wrap text-slate-300 leading-relaxed">
                        {item.campaign_content}
                      </div>
                    </div>
                  )}

                  {item.campaign_content && (
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          item.campaign_content || ""
                        )
                      }
                      className="mt-5 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition"
                    >
                      📋 Copy Campaign
                    </button>
                  )}

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