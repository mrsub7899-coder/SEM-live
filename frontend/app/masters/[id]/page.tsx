"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch, API_URL } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";

type Master = {
  id: string;
  name: string;
  email: string;
};

export default function MasterStorefrontPage() {
  const params = useParams();
  const masterId = params?.id as string;
  const [master, setMaster] = useState<Master | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const presence = usePresence(user?.id || "");
  const isOnline = presence[master.id];

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API_URL}/auth/masters/${masterId}`);
      const data = await res.json();
      setMaster(data);
      setLoading(false);
    }
    load();
  }, [masterId]);

  async function handleBuyChatAccess() {
    if (!user) {
      router.push("/login");
      return;
    }
    setBuying(true);
    setError(null);
    try {
      await apiFetch("/chat-access/buy", {
        method: "POST",
        body: JSON.stringify({ masterId }),
      });
      alert("Chat access purchased!");
    } catch (err: any) {
      setError(err.message || "Failed to buy chat access");
    } finally {
      setBuying(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading master...</p>
      </main>
    );
  }

  if (!master) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-400">Master not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto space-y-6">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <h1 className="text-3xl font-semibold mb-2">
          {master.name || "Master"}
        </h1>
<p className="text-sm mt-2">
  Status:{" "}
  {isOnline ? (
    <span className="text-green-400">Online</span>
  ) : (
    <span className="text-gray-500">Offline</span>
  )}
</p>
        <p className="text-gray-500 text-sm">
          This is a public master profile. You can buy chat access or purchase a session.
        </p>
<p className="text-gray-300 text-lg mt-2">
  Chat Price:{" "}
  <span className="text-purple-400 font-semibold">
    {master.chatPrice ?? 0} credits
  </span>
</p>
      </div>

      {/* ✅ BUY CHAT ACCESS */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-2">Buy Chat Access</h2>

        <p className="text-gray-400 text-sm mb-4">
          Unlock the ability to message this master directly, even without an active session.
        </p>

        {error && <p className="text-red-400 mb-2">{error}</p>}

        <button
          onClick={handleBuyChatAccess}
          disabled={buying}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-white disabled:bg-gray-700"
        >
          {buying ? "Processing..." : "Buy Chat Access"}
        </button>
      </div>
    </main>
  );
}
