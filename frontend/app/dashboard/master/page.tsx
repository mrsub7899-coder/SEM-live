// frontend/app/dashboard/master/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";

type Client = {
  id: string;
  name: string;
  email: string;
};

type Session = {
  id: string;
  status: string;
  user: { id: string; name: string; email: string };
};

export default function MasterDashboard() {
  const { user, logout } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function load() {
      const profile = await apiFetch("/auth/profile");
      setCredits(profile.credits);

      const c = await apiFetch("/sessions/master/clients");
      setClients(c);

      const sess = await apiFetch("/sessions/master/my-sessions");
      setSessions(sess);
      setLoading(false);
    }

    load();
  }, [user]);

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">
          You are not logged in. <a href="/login" className="text-blue-400 underline">Login</a>
        </p>
      </main>
    );
  }

  if (user.role !== "MASTER") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">This dashboard is for masters only.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Master Dashboard</h1>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-lg">
            Credits:{" "}
            <span className="font-semibold">
              {credits === null ? "…" : credits}
            </span>
          </p>
          <button
            onClick={logout}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded"
          >
            Logout
          </button>
        </div>
      </header>

 <section className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Master Dashboard — {user.name || user.email}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Your performance, rank, and impact on mentees.
          </p>
        </div>

        <div className="flex flex-col items-end">
          <RankBadge level={user.rankLevel} />
          <p className="text-xs text-gray-400 mt-1">
            {user.rankPoints} RP total
          </p>
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Rank Progress</h2>
        <p className="text-sm text-gray-400">
          Earn rank points from likes, completed sessions, approved proofs, and chat access purchases.
        </p>
        <RankProgress
          rankPoints={user.rankPoints}
          rankLevel={user.rankLevel}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Your Clients</h2>
        {loading ? (
          <p className="text-gray-400">Loading clients...</p>
        ) : clients.length === 0 ? (
          <p className="text-gray-500">No clients yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clients.map((c) => (
              <div
                key={c.id}
                className="bg-gray-900 border border-gray-700 rounded-lg p-4"
              >
                <p className="text-lg">{c.name}</p>
                <p className="text-gray-400 text-sm">{c.email}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Sessions</h2>
        {loading ? (
          <p className="text-gray-400">Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p className="text-gray-500">No sessions yet.</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex justify-between"
              >
                <div>
                  <p className="text-lg">Session with {s.user?.name || "User"}</p>
                  <p className="text-gray-500 text-sm">
                    Status:{" "}
                    <span
                      className={
                        s.status === "ACTIVE"
                          ? "text-green-400"
                          : "text-gray-400"
                      }
                    >
                      {s.status}
                    </span>
                  </p>
                </div>
<div className="flex gap-3">
  <a
    href={`/sessions/${s.id}/manage`}
    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm"
  >
    Manage
  </a>

  <a
    href={`/sessions/${s.id}/review`}
    className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm"
  >
    Review
  </a>
</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
