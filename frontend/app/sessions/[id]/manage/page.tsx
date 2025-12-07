"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "../../../../lib/api";
import { useAuth } from "../../../../context/AuthContext";
import TaskCreationWizard from "../../../../components/TaskCreationWizard";
import SessionHeader from "../../../../components/SessionHeader";
import SessionSideNav from "../../../../components/SessionSideNav";

export default function ManageSessionPage() {
  const params = useParams();
  const sessionId = params?.id as string;
  const { user } = useAuth();

  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await apiFetch(`/sessions/${sessionId}`);
      setSession(data);
      setLoading(false);
    }
    load();
  }, [sessionId]);

  if (!user || user.role !== "MASTER") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Only masters can manage sessions.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading session...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto flex gap-8">
      <SessionSideNav sessionId={sessionId} />

      <div className="flex-1">
        <SessionHeader session={session} sessionId={sessionId} />

        <TaskCreationWizard sessionId={sessionId} />

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Existing Tasks</h2>

          {session.tasks.length === 0 ? (
            <p className="text-gray-500">No tasks yet.</p>
          ) : (
            <div className="space-y-4">
              {session.tasks.map((t: any) => (
                <div
                  key={t.id}
                  className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex justify-between"
                >
                  <div>
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
                  </div>

                  <a
                    href={`/sessions/${sessionId}/review`}
                    className="self-center px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm"
                  >
                    Review
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
