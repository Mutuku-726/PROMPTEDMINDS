"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "./components/Sidebar";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const supabase = createClient();

  const [campaignCount, setCampaignCount] = useState<number | null>(null);
  const [captionCount, setCaptionCount] = useState<number | null>(null);
  const [leadCount, setLeadCount] = useState<number | null>(null);
  const [conversionRate, setConversionRate] = useState<number | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      // Campaign count
      const { count: campaigns, error: campaignError } =
        await supabase
          .from("ad_campaigns")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

      if (campaignError) {
        console.error("Dashboard campaign error:", campaignError);
      } else {
        setCampaignCount(campaigns ?? 0);
      }

      // Caption count
      const { count: captions, error: captionError } =
        await supabase
          .from("captions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

      if (captionError) {
        console.error("Dashboard caption error:", captionError);
      } else {
        setCaptionCount(captions ?? 0);
      }

      // Lead count
      const { count: leads, error: leadError } =
        await supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

      if (leadError) {
        console.error("Dashboard lead error:", leadError);
      } else {
        const totalLeads = leads ?? 0;

        setLeadCount(totalLeads);

        // Converted leads
        const { count: convertedLeads, error: convertedError } =
          await supabase
            .from("leads")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("status", "converted");

        if (convertedError) {
          console.error(
            "Dashboard conversion error:",
            convertedError
          );

          setConversionRate(0);
        } else {
          const totalConverted = convertedLeads ?? 0;

          const rate =
            totalLeads > 0
              ? (totalConverted / totalLeads) * 100
              : 0;

          setConversionRate(rate);
        }
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      <main className="flex-1 p-10">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-blue-400">
              PromptedMinds
            </h1>

            <p className="mt-2 text-slate-400">
              Your AI Marketing Operating System
            </p>
          </div>

          {/* Welcome */}
          <div className="mt-8">
            <h2 className="text-3xl font-bold">
              Marketing Dashboard
            </h2>

            <p className="mt-2 text-slate-400">
              Manage your marketing activity and track your growth from one
              workspace.
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

            {/* Leads */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 text-sm">
                Total Leads
              </p>

              <h3 className="text-3xl font-bold mt-3">
                {leadCount === null ? "..." : leadCount}
              </h3>

              <p className="text-slate-500 text-sm mt-2">
                Leads in your workspace
              </p>
            </div>

            {/* Campaigns */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 text-sm">
                Campaigns Created
              </p>

              <h3 className="text-3xl font-bold mt-3">
                {campaignCount === null ? "..." : campaignCount}
              </h3>

              <p className="text-slate-500 text-sm mt-2">
                AI campaigns created
              </p>
            </div>

            {/* Content */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 text-sm">
                Content Generated
              </p>

              <h3 className="text-3xl font-bold mt-3">
                {captionCount === null ? "..." : captionCount}
              </h3>

              <p className="text-slate-500 text-sm mt-2">
                Saved AI captions
              </p>
            </div>

            {/* Conversion */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 text-sm">
                Conversion Rate
              </p>

              <h3 className="text-3xl font-bold mt-3">
                {conversionRate === null
                  ? "..."
                  : `${conversionRate.toFixed(1)}%`}
              </h3>

              <p className="text-slate-500 text-sm mt-2">
                Converted leads
              </p>
            </div>

          </div>

          {/* Quick Actions */}
          <div className="mt-10">

            <h2 className="text-2xl font-bold">
              Quick Actions
            </h2>

            <p className="text-slate-400 mt-1">
              Jump directly into the tools you use most.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

              <Link
                href="/captions"
                className="bg-slate-900 border border-slate-800 hover:border-blue-500 rounded-2xl p-6 transition"
              >
                <div className="text-3xl">
                  ✍️
                </div>

                <h3 className="text-xl font-semibold mt-4">
                  Generate Caption
                </h3>

                <p className="text-slate-400 text-sm mt-2">
                  Create social media content with AI.
                </p>

                <p className="text-blue-400 text-sm mt-4">
                  Open AI Captions →
                </p>
              </Link>

              <Link
                href="/ads"
                className="bg-slate-900 border border-slate-800 hover:border-blue-500 rounded-2xl p-6 transition"
              >
                <div className="text-3xl">
                  📢
                </div>

                <h3 className="text-xl font-semibold mt-4">
                  Build Campaign
                </h3>

                <p className="text-slate-400 text-sm mt-2">
                  Build a practical advertising campaign.
                </p>

                <p className="text-blue-400 text-sm mt-4">
                  Open AI Ads →
                </p>
              </Link>

              <Link
                href="/leads"
                className="bg-slate-900 border border-slate-800 hover:border-blue-500 rounded-2xl p-6 transition"
              >
                <div className="text-3xl">
                  👥
                </div>

                <h3 className="text-xl font-semibold mt-4">
                  Add Lead
                </h3>

                <p className="text-slate-400 text-sm mt-2">
                  Capture and manage potential customers.
                </p>

                <p className="text-blue-400 text-sm mt-4">
                  Open Lead Management →
                </p>
              </Link>

            </div>

          </div>

          {/* Analytics Link */}
          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <h2 className="text-xl font-semibold">
                  📊 Marketing Analytics
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  View detailed campaign, lead and conversion activity.
                </p>
              </div>

              <Link
                href="/analytics"
                className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-lg font-semibold transition text-center"
              >
                View Analytics →
              </Link>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}