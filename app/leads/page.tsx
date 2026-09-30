"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import { createClient } from "@/lib/supabase/client";

type Lead = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  status: string;
  created_at: string;
};

const statusOptions = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "lost",
];

export default function LeadsPage() {
  const supabase = createClient();

  const [leads, setLeads] = useState<Lead[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("new");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadLeads = async () => {
      setLoading(true);
      setError("");

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("You must be logged in to view your leads.");
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from("leads")
          .select(
            "id, name, email, phone, source, status, created_at"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error("Load leads error:", fetchError);
          setError("Failed to load your leads.");
        } else {
          setLeads(data || []);
        }
      } catch (err) {
        console.error("Load leads error:", err);
        setError("Something went wrong while loading your leads.");
      }

      setLoading(false);
    };

    loadLeads();
  }, []);

  const handleAddLead = async () => {
    if (!name.trim()) {
      setError("Please enter the lead's name.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in to add a lead.");
        setSaving(false);
        return;
      }

      const { data, error: insertError } = await supabase
        .from("leads")
        .insert({
          user_id: user.id,
          name: name.trim(),
          email: email.trim() || null,
          phone: phone.trim() || null,
          source: source.trim() || null,
          status,
        })
        .select(
          "id, name, email, phone, source, status, created_at"
        )
        .single();

      if (insertError) {
        console.error("Add lead error:", insertError);
        setError("Failed to add lead.");
      } else if (data) {
        setLeads((prev) => [data, ...prev]);

        setName("");
        setEmail("");
        setPhone("");
        setSource("");
        setStatus("new");

        setSuccess("Lead added successfully! ✅");
      }
    } catch (err) {
      console.error("Add lead error:", err);
      setError("Something went wrong while adding the lead.");
    }

    setSaving(false);
  };

  const handleStatusChange = async (
    leadId: string,
    newStatus: string
  ) => {
    setError("");
    setSuccess("");

    const { error: updateError } = await supabase
      .from("leads")
      .update({
        status: newStatus,
      })
      .eq("id", leadId);

    if (updateError) {
      console.error("Update lead status error:", updateError);
      setError("Failed to update lead status.");
      return;
    }

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? { ...lead, status: newStatus }
          : lead
      )
    );

    setSuccess("Lead status updated successfully! ✅");
  };

  const handleDeleteLead = async (leadId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    const { error: deleteError } = await supabase
      .from("leads")
      .delete()
      .eq("id", leadId);

    if (deleteError) {
      console.error("Delete lead error:", deleteError);
      setError("Failed to delete lead.");
      return;
    }

    setLeads((prev) =>
      prev.filter((lead) => lead.id !== leadId)
    );

    setSuccess("Lead deleted successfully.");
  };

  // Search and filter leads
  const filteredLeads = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        !search ||
        (lead.name || "").toLowerCase().includes(search) ||
        (lead.email || "").toLowerCase().includes(search) ||
        (lead.phone || "").toLowerCase().includes(search) ||
        (lead.source || "").toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      <main className="flex-1 p-10">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-blue-400">
              Lead Management
            </h1>

            <p className="mt-2 text-slate-400">
              Capture, organize and manage your marketing leads.
            </p>
          </div>

          {/* Add Lead */}
          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <h2 className="text-2xl font-semibold">
              Add New Lead
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Add a potential customer to your workspace.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

              {/* Name */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Name *
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Kamau"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Phone
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0712345678"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Lead Source
                </label>

                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. Instagram, WhatsApp, Website"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() +
                        option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {error && (
              <div className="mt-6 bg-red-900/40 border border-red-700 text-red-200 p-4 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-6 bg-green-900/40 border border-green-700 text-green-200 p-4 rounded-lg">
                {success}
              </div>
            )}

            <button
              onClick={handleAddLead}
              disabled={saving}
              className="mt-6 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition"
            >
              {saving ? "Adding Lead..." : "➕ Add Lead"}
            </button>

          </div>

          {/* Leads */}
          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <div className="flex items-center justify-between gap-4">

              <div>
                <h2 className="text-2xl font-semibold">
                  Your Leads
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  Manage the people interested in your business.
                </p>
              </div>

              <span className="text-sm bg-slate-800 px-3 py-2 rounded-lg text-slate-300 whitespace-nowrap">
                {filteredLeads.length} of {leads.length}
              </span>

            </div>

            {/* Search and Filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

              <div className="md:col-span-2">
                <label className="block text-sm text-slate-400 mb-2">
                  Search leads
                </label>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, phone or source..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Filter by status
                </label>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>

                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() +
                        option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {loading ? (
              <div className="mt-6 bg-slate-800 rounded-xl p-6 text-slate-400">
                Loading your leads...
              </div>
            ) : leads.length === 0 ? (
              <div className="mt-6 bg-slate-800 rounded-xl p-6 text-slate-400">
                No leads yet. Add your first lead above.
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="mt-6 bg-slate-800 rounded-xl p-6 text-slate-400">
                No leads match your search or filter.
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto">

                <table className="w-full text-left">

                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-sm">
                      <th className="pb-4 pr-4">
                        Name
                      </th>

                      <th className="pb-4 pr-4">
                        Contact
                      </th>

                      <th className="pb-4 pr-4">
                        Source
                      </th>

                      <th className="pb-4 pr-4">
                        Status
                      </th>

                      <th className="pb-4 pr-4">
                        Created
                      </th>

                      <th className="pb-4">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-b border-slate-800 last:border-b-0"
                      >

                        <td className="py-4 pr-4 font-medium">
                          {lead.name || "Unnamed Lead"}
                        </td>

                        <td className="py-4 pr-4 text-slate-400">
                          <div>
                            {lead.email || "No email"}
                          </div>

                          {lead.phone && (
                            <div className="text-xs text-slate-500 mt-1">
                              {lead.phone}
                            </div>
                          )}
                        </td>

                        <td className="py-4 pr-4 text-slate-400">
                          {lead.source || "Unknown"}
                        </td>

                        <td className="py-4 pr-4">

                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleStatusChange(
                                lead.id,
                                e.target.value
                              )
                            }
                            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                          >
                            {statusOptions.map((option) => (
                              <option
                                key={option}
                                value={option}
                              >
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
                              </option>
                            ))}
                          </select>

                        </td>

                        <td className="py-4 pr-4 text-slate-400">
                          {new Date(
                            lead.created_at
                          ).toLocaleDateString()}
                        </td>

                        <td className="py-4">

                          <button
                            onClick={() =>
                              handleDeleteLead(lead.id)
                            }
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            🗑️ Delete
                          </button>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}