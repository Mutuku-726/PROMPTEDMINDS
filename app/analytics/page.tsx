"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { createClient } from "@/lib/supabase/client";

type RecentCampaign = {
  id: string;
  business_name: string;
  product: string;
  campaign_goal: string;
  created_at: string;
};

type Lead = {
  created_at: string;
};

export default function AnalyticsPage() {
  const supabase = createClient();

  const [campaignCount, setCampaignCount] = useState<number | null>(null);
  const [captionCount, setCaptionCount] = useState<number | null>(null);
  const [leadCount, setLeadCount] = useState<number | null>(null);
  const [conversionRate, setConversionRate] = useState<number | null>(null);

  const [recentCampaigns, setRecentCampaigns] = useState<
    RecentCampaign[]
  >([]);

  const [monthlyLeads, setMonthlyLeads] = useState<number[]>(
    Array(12).fill(0)
  );

  useEffect(() => {
    const loadAnalytics = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      // Count campaigns
      const { count: campaigns, error: campaignError } = await supabase
        .from("ad_campaigns")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (campaignError) {
        console.error("Campaign count error:", campaignError);
      } else {
        setCampaignCount(campaigns ?? 0);
      }

      // Load recent campaigns
      const { data: campaignsData, error: recentCampaignError } =
        await supabase
          .from("ad_campaigns")
          .select(
            "id, business_name, product, campaign_goal, created_at"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

      if (recentCampaignError) {
        console.error(
          "Recent campaigns error:",
          recentCampaignError
        );
      } else {
        setRecentCampaigns(campaignsData || []);
      }

      // Count saved captions
      const { count: captions, error: captionError } = await supabase
        .from("captions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (captionError) {
        console.error("Caption count error:", captionError);
      } else {
        setCaptionCount(captions ?? 0);
      }

      // Load leads
      const { data: leadsData, error: leadDataError } = await supabase
        .from("leads")
        .select("created_at")
        .eq("user_id", user.id);

      if (leadDataError) {
        console.error("Lead activity error:", leadDataError);
      } else {
        const currentYear = new Date().getFullYear();

        const monthlyCounts = Array(12).fill(0);

        (leadsData as Lead[] | null)?.forEach((lead) => {
          const date = new Date(lead.created_at);

          if (date.getFullYear() === currentYear) {
            const month = date.getMonth();
            monthlyCounts[month] += 1;
          }
        });

        setMonthlyLeads(monthlyCounts);
      }

      // Count all leads
      const { count: leads, error: leadError } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (leadError) {
        console.error("Lead count error:", leadError);
      } else {
        const totalLeads = leads ?? 0;

        setLeadCount(totalLeads);

        // Count converted leads
        const { count: convertedLeads, error: convertedError } =
          await supabase
            .from("leads")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("status", "converted");

        if (convertedError) {
          console.error(
            "Converted lead count error:",
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

    loadAnalytics();
  }, []);

  const maxMonthlyLeads = Math.max(...monthlyLeads, 1);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Dynamic data-driven insights
  const insights = [
    {
      icon: "📊",
      title: "Lead tracking",
      description:
        leadCount === null
          ? "Loading your lead activity..."
          : leadCount === 0
          ? "No leads have been recorded yet. Add leads to start measuring marketing performance."
          : `${leadCount} lead${
              leadCount === 1 ? "" : "s"
            } currently recorded in your workspace.`,
    },

    {
      icon: "🎯",
      title: "Conversion performance",
      description:
        conversionRate === null
          ? "Calculating your conversion rate..."
          : leadCount === 0
          ? "Your conversion rate will appear once your workspace has leads."
          : `Your current lead conversion rate is ${conversionRate.toFixed(
              1
            )}%. Keep lead statuses updated for accurate reporting.`,
    },

    {
      icon: "📢",
      title: "Campaign opportunity",
      description:
        campaignCount === null
          ? "Checking your campaign activity..."
          : campaignCount === 0
          ? "You haven't created any campaigns yet. Create your first campaign to begin tracking campaign activity."
          : `${campaignCount} campaign${
              campaignCount === 1 ? "" : "s"
            } created in your workspace. Continue testing different campaign angles.`,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      <main className="flex-1 min-w-0 p-4 md:p-10">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-blue-400">
              Marketing Analytics
            </h1>

            <p className="mt-2 text-slate-400">
              Track your marketing performance and understand what is driving
              growth.
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

            {/* Campaigns Created */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 text-sm">
                Campaigns Created
              </p>

              <h2 className="text-3xl font-bold mt-3">
                {campaignCount === null ? "..." : campaignCount}
              </h2>

              <p className="text-slate-400 text-sm mt-2">
                Total campaigns in your workspace
              </p>
            </div>

            {/* Content Generated */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 text-sm">
                Content Generated
              </p>

              <h2 className="text-3xl font-bold mt-3">
                {captionCount === null ? "..." : captionCount}
              </h2>

              <p className="text-slate-400 text-sm mt-2">
                Saved captions in your workspace
              </p>
            </div>

            {/* Leads Generated */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 text-sm">
                Leads Generated
              </p>

              <h2 className="text-3xl font-bold mt-3">
                {leadCount === null ? "..." : leadCount}
              </h2>

              <p className="text-slate-400 text-sm mt-2">
                Leads in your workspace
              </p>
            </div>

            {/* Conversion Rate */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 text-sm">
                Conversion Rate
              </p>

              <h2 className="text-3xl font-bold mt-3">
                {conversionRate === null
                  ? "..."
                  : `${conversionRate.toFixed(1)}%`}
              </h2>

              <p className="text-slate-400 text-sm mt-2">
                Converted leads vs total leads
              </p>
            </div>

          </div>

          {/* Performance Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

            {/* Real Lead Activity */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Lead Activity
                  </h2>

                  <p className="text-slate-400 text-sm mt-1">
                    Leads created each month this year.
                  </p>
                </div>

                <span className="text-sm bg-slate-800 px-3 py-2 rounded-lg text-slate-300">
                  {new Date().getFullYear()}
                </span>
              </div>

              <div className="mt-8 h-56 flex items-end gap-3">

                {monthlyLeads.map((count, index) => {
                  const height =
                    count === 0
                      ? 8
                      : Math.max(
                          (count / maxMonthlyLeads) * 180,
                          12
                        );

                  return (
                    <div
                      key={months[index]}
                      className="flex-1 h-full flex flex-col justify-end items-center"
                    >
                      <span className="text-xs text-slate-400 mb-2">
                        {count}
                      </span>

                      <div
                        className="w-full bg-blue-600 rounded-t-lg hover:bg-blue-500 transition"
                        style={{
                          height: `${height}px`,
                        }}
                        title={`${count} lead${
                          count === 1 ? "" : "s"
                        }`}
                      />
                    </div>
                  );
                })}

              </div>

              <div className="flex justify-between text-xs text-slate-500 mt-3">
                {months.map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>

            </div>

            {/* Dynamic Insights */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <h2 className="text-xl font-semibold">
                🧠 Data Insights
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                Insights based on your actual workspace data.
              </p>

              <div className="mt-6 space-y-4">

                {insights.map((insight) => (
                  <div
                    key={insight.title}
                    className="bg-slate-800 rounded-xl p-4"
                  >
                    <p className="font-medium">
                      {insight.icon} {insight.title}
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      {insight.description}
                    </p>
                  </div>
                ))}

              </div>
            </div>

          </div>

          {/* Recent Campaigns */}
          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Recent Campaigns
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  Your latest campaigns created in PromptedMinds.
                </p>
              </div>

              <span className="text-sm text-slate-500">
                {recentCampaigns.length} recent
              </span>
            </div>

            <div className="mt-6 overflow-x-auto">

              {recentCampaigns.length === 0 ? (
                <div className="bg-slate-800 rounded-xl p-6 text-slate-400">
                  No campaigns created yet.
                </div>
              ) : (
                <table className="w-full text-left">

                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-sm">
                      <th className="pb-4">Campaign</th>
                      <th className="pb-4">Product / Service</th>
                      <th className="pb-4">Goal</th>
                      <th className="pb-4">Created</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentCampaigns.map((campaign) => (
                      <tr
                        key={campaign.id}
                        className="border-b border-slate-800 last:border-b-0"
                      >
                        <td className="py-4 font-medium">
                          {campaign.business_name}
                        </td>

                        <td className="py-4 text-slate-400">
                          {campaign.product}
                        </td>

                        <td className="py-4 text-slate-400">
                          {campaign.campaign_goal}
                        </td>

                        <td className="py-4 text-slate-400">
                          {new Date(
                            campaign.created_at
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              )}

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}