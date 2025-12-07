"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

type Message = {
  id: string;
  text: string;
  createdAt: string;
};

type Task = {
  id: string;
  title: string;
  createdAt: string;
};

type Session = {
  id: string;
  createdAt: string;
  master: { id: string; name: string; email: string };
  user: { id: string; name: string; email: string };
};

type Rank = {
  points: number;
  level: number;
};

type NotificationsOverview = {
  messages: Message[];
  tasks: Task[];
  sessions: Session[];
  rank: Rank;
};

export default function NotificationsPanel() {
  const [data, setData] = useState<NotificationsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/notifications/overview")
      .then((res) => setData(res))
      .catch((err) => console.error("Failed to load notifications", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-400">Loading notifications...</p>;
  if (!data) return <p className="text-red-400">Failed to load notifications.</p>;

  return (
    <div className="space-y-6">
      {/* Rank Progress */}
      <section className="card p-4">
        <h2 className="text-lg font-semibold">Rank Progress</h2>
        <p>Level: {data.rank.level}</p>
        <p>Points: {data.rank.points}</p>
        <div className="w-full bg-gray-700 rounded h-3 mt-2">
          <div
            className="bg-green-500 h-3 rounded"
            style={{ width: `${(data.rank.points % 100)}%` }}
          />
        </div>
      </section>

      {/* Messages */}
      <section className="card p-4">
        <h2 className="text-lg font-semibold">Recent Messages</h2>
        {data.messages.length === 0 ? (
          <p className="text-gray-400">No messages yet.</p>
        ) : (
          <ul className="space-y-2">
            {data.messages.map((m) => (
              <li key={m.id} className="text-sm">
                <span className="text-gray-300">{new Date(m.createdAt).toLocaleString()}:</span>{" "}
                {m.text}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Tasks */}
      <section className="card p-4">
        <h2 className="text-lg font-semibold">Recent Tasks</h2>
        {data.tasks.length === 0 ? (
          <p className="text-gray-400">No tasks yet.</p>
        ) : (
          <ul className="space-y-2">
            {data.tasks.map((t) => (
              <li key={t.id} className="text-sm">
                <span className="text-gray-300">{new Date(t.createdAt).toLocaleDateString()}:</span>{" "}
                {t.title}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Sessions */}
      <section className="card p-4">
        <h2 className="text-lg font-semibold">Recent Sessions</h2>
        {data.sessions.length === 0 ? (
          <p className="text-gray-400">No sessions yet.</p>
        ) : (
          <ul className="space-y-2">
            {data.sessions.map((s) => (
              <li key={s.id} className="text-sm">
                <span className="text-gray-300">{new Date(s.createdAt).toLocaleDateString()}:</span>{" "}
                {s.user.name ?? s.user.email} ↔ {s.master.name ?? s.master.email}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
