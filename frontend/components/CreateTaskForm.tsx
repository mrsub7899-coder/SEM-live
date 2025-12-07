"use client";

import { useState } from "react";
import { apiFetch } from "../lib/api";

export default function CreateTaskForm({ sessionId }: { sessionId: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bounty, setBounty] = useState(10);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify({
          sessionId,
          title,
          description,
          bounty,
        }),
      });

      setSuccess("Task created successfully");
      setTitle("");
      setDescription("");
      setBounty(10);
    } catch (err: any) {
      setError(err.message || "Failed to create task");
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-lg space-y-4"
    >
      <h2 className="text-xl font-semibold text-white">Create New Task</h2>

      {success && <p className="text-green-400">{success}</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div>
        <label className="text-gray-300 text-sm">Title</label>
        <input
          className="w-full mt-1 px-3 py-2 rounded bg-black border border-gray-700 text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-gray-300 text-sm">Description</label>
        <textarea
          className="w-full mt-1 px-3 py-2 rounded bg-black border border-gray-700 text-white"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-gray-300 text-sm">Bounty (credits)</label>
        <input
          type="number"
          className="w-full mt-1 px-3 py-2 rounded bg-black border border-gray-700 text-white"
          value={bounty}
          min={1}
          onChange={(e) => setBounty(Number(e.target.value))}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold disabled:bg-gray-600"
      >
        {loading ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}
