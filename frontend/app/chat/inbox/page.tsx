"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import { usePresence } from "../../../hooks/usePresence";

type InboxItem = {
  id: string;
  userId: string;
  masterId: string;
  user?: { id: string; name: string | null; email: string };
  master?: { id: string; name: string | null; email: string };
};

export default function ChatInboxPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);

  const presence = usePresence(user?.id || "");

  useEffect(() => {
    if (!user) return;

    async function load() {
      const data = await apiFetch("/global-chat/inbox");
      setItems(data);
      setLoading(false);
    }

    load();
  }, [user]);

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Please log in to view your chat inbox.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading chat inbox...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold mb-4">Chat Inbox</h1>

      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">No chat partners yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const isUser = user.role === "USER";
            const other =
              isUser ? item.master : item.user; // the person you’re talking to
            const otherId = other?.id || (isUser ? item.masterId : item.userId);
            const isOnline = !!presence[otherId];

            return (
              <a
                key={item.id}
                href={`/chat/thread/${otherId}`}
                className="flex items-center justify-between bg-gray-900 border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition"
              >
                <div>
                  <p className="text-lg">
                    {other?.name || other?.email || "Unknown"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {other?.email || "No email"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm">
                    {isOnline ? (
                      <span className="text-green-400">Online</span>
                    ) : (
                      <span className="text-gray-500">Offline</span>
                    )}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </main>
  );
}
