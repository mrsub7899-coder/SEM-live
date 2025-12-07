"use client";

import { useEffect, useState } from "react";

export default function MasterReview({ sessionId }: { sessionId: string }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`http://localhost:3001/sessions/${sessionId}`);
      const data = await res.json();
      setTasks(data.tasks || []);
      setLoading(false);
    }
    load();
  }, [sessionId]);

  async function updateStatus(taskId: string, status: 'COMPLETED' | 'FAILED') {
    setActionLoading(taskId);

    await fetch(`http://localhost:3001/tasks/${taskId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status } : t
      )
    );

    setActionLoading(null);
  }

  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-10">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-semibold text-gray-200 mb-6">
        Master Review Panel
      </h1>

      {tasks.length === 0 && (
        <p className="text-gray-400">No tasks found for this session.</p>
      )}

      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg"
        >
          <div>
            <h2 className="text-xl font-semibold text-white">{task.title}</h2>
            <p className="text-gray-400 mt-1">{task.description}</p>
            <p className="text-gray-500 text-sm mt-2">
              Bounty: {task.bounty} credits
            </p>
            <p className="text-gray-500 text-sm">
              Status:{" "}
              <span
                className={
                  task.status === "PENDING"
                    ? "text-yellow-400"
                    : task.status === "COMPLETED"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {task.status}
              </span>
            </p>
          </div>

          {task.submissions?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-gray-300 font-medium mb-3">Submitted Proof</h3>

              {task.submissions.map((sub: any) => (
                <div key={sub.id} className="space-y-4">
                  {sub.proofType === "IMAGE" && (
                    <img
                      src={sub.proofUrl}
                      alt="Proof"
                      className="rounded-lg max-h-80 border border-gray-700 shadow-md"
                    />
                  )}

                  {sub.proofType === "VIDEO" && (
                    <video
                      src={sub.proofUrl}
                      controls
                      className="rounded-lg max-h-80 border border-gray-700 shadow-md"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {task.status === "PENDING" && (
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => updateStatus(task.id, "COMPLETED")}
                disabled={actionLoading === task.id}
                className="px-5 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition disabled:bg-gray-600"
              >
                {actionLoading === task.id ? "Processing..." : "Approve"}
              </button>

              <button
                onClick={() => updateStatus(task.id, "FAILED")}
                disabled={actionLoading === task.id}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition disabled:bg-gray-600"
              >
                {actionLoading === task.id ? "Processing..." : "Fail Task"}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
