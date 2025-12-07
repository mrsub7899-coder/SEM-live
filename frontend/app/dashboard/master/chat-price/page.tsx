"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "../../../../lib/api";
import { useAuth } from "../../../../context/AuthContext";

export default function ChatPricePage() {
  const { user } = useAuth();
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const profile = await apiFetch("/auth/profile");
      setPrice(profile.chatPrice || 0);
      setLoading(false);
    }
    load();
  }, []);

  async function save() {
    const res = await apiFetch("/chat-access/set-price", {
      method: "POST",
      body: JSON.stringify({ price }),
    });
    setMsg("Saved!");
  }

  if (loading) return <p className="p-8 text-gray-400">Loading…</p>;

  return (
    <main className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Set Chat Price</h1>

      <p className="text-gray-400 text-sm">
        This is the price users must pay to unlock chat access with you.
      </p>

      <input
        type="number"
        className="w-full px-3 py-2 bg-black border border-gray-700 rounded"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />

      <button
        onClick={save}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
      >
        Save Price
      </button>

      {msg && <p className="text-green-400">{msg}</p>}
    </main>
  );
}
