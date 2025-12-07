"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "../../../lib/api";
import ProofUploader from "../../../components/ProofUploader";
import SessionChat from "../../../components/SessionChat";
import { useAuth } from "../../../context/AuthContext";

export default function SessionPage() {
  const params = useParams();
  const sessionId = params?.id as string;
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function load() {
      const data = await apiFetch(`/sessions/${sessionId}`);
      setSession(data);
      setLoading(false);
    }
    load();
  }, [sessionId]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading session...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-400">Session not found</p>
      </main>
    );
  }

  const canChat =
    user &&
    (
      session.userId === user.id ||
      session.masterId === user.id ||
      session.chatAccess?.some((a: any) => a.userId === user.id)
    );

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">

      <h1 className="text-2xl font-semibold mb-4">
        Session with {session.master?.name || "Master"}
      </h1>

      <section className="space-y-4">
        {session.tasks.map((t: any) => (
          <div
            key={t.id}
            className="bg-gray-900 border border-gray-700 rounded-lg p-4"
          >
            <p className="text-lg">{t.title}</p>
            <p className="text-gray-400 text-sm">{t.description}</p>
            <p className="text-gray-500 text-sm mt-1">
              Bounty: {t.bounty} credits
            </p>
            <p className="text-gray-500 text-sm">
              Status:{" "}
              <span
                className={
                  t.status === "PENDING"
                    ? "text-yellow-400"
                    : t.status === "COMPLETED"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {t.status}
              </span>
            </p>

            {t.status === "PENDING" && user?.role === "USER" && (
              <div className="mt-4">
                <ProofUploader taskId={t.id} userId={user.id} />
              </div>
            )}
          </div>
        ))}
      </section>

      {/* ✅ CHAT SECTION */}
      {canChat && (
        <div id="chat" className="mt-10">
          <SessionChat sessionId={sessionId} />
        </div>
      )}
    </main>
  );
}
