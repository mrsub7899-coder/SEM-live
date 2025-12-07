// frontend/app/dashboard/user/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";

type Session = {
  id: string;
  status: string;
  master: { id: string; name: string; email: string };
};

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [topupAmount, setTopupAmount] = useState(50);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function load() {
      const profile = await apiFetch("/auth/profile");
      setCredits(profile.credits);

      const sess = await apiFetch("/sessions/user/my-sessions");
      setSessions(sess);
      setLoading(false);
    }

    load();
  }, [user]);

  async function handleTopup() {
    const res = await apiFetch("/auth/credits/topup", {
      method: "POST",
      body: JSON.stringify({ amount: topupAmount }),
    });
    setCredits(res.credits);
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">
          You are not logged in. <a href="/login" className="text-blue-400 underline">Login</a>
        </p>
      </main>
    );
  }

  if (user.role !== "USER") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">This dashboard is for users only.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold">User Dashboard</h1>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded"
        >
          Logout
        </button>
      </header>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Credits</h2>
        <div className="flex items-center gap-6">
          <p className="text-2xl">
            {credits === null ? "…" : `${credits} credits`}
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-24 px-2 py-1 rounded bg-black border border-gray-700 text-white"
              value={topupAmount}
              onChange={(e) => setTopupAmount(Number(e.target.value))}
            />
            <button
              onClick={handleTopup}
              className="px-4 py-1 bg-blue-600 hover:bg-blue-500 rounded"
            >
              Top Up
            </button>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome back, {user.name || user.email}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Track your progress and rank as a user.
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
          Earn rank points by completing tasks, finishing sessions, and being active.
        </p>
        <RankProgress
          rankPoints={user.rankPoints}
          rankLevel={user.rankLevel}
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">My Sessions</h2>
        {loading ? (
          <p className="text-gray-400">Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p className="text-gray-500">You have no sessions yet.</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex justify-between"
              >
                <div>
                  <p className="text-lg">Session with {s.master?.name || "Unknown Master"}</p>
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
                <a
                  href={`/sessions/${s.id}`}
                  className="self-center px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm"
                >
                  View
                </a>
		<p className="mt-4 text-sm text-gray-400">
 		 Want to start a new journey?{" "}
  		<a href="/masters" className="text-blue-400 underline">
    		Browse masters
  		</a>
		</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
