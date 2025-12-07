"use client";

import { useAuth } from "../context/AuthContext";

export default function SessionSideNav({
  sessionId,
}: {
  sessionId: string;
}) {
  const { user } = useAuth();

  return (
    <aside className="w-56 shrink-0 bg-gray-900 border border-gray-800 rounded-xl p-4 h-fit sticky top-24">
      <nav className="space-y-2 text-sm">
        <a
          href={`/sessions/${sessionId}`}
          className="block px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-200"
        >
          Tasks
        </a>

        <a
          href={`/sessions/${sessionId}#chat`}
          className="block px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-200"
        >
          Chat
        </a>

        {user?.role === "MASTER" && (
          <>
            <a
              href={`/sessions/${sessionId}/manage`}
              className="block px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-200"
            >
              Manage Tasks
            </a>

            <a
              href={`/sessions/${sessionId}/review`}
              className="block px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-200"
            >
              Review Submissions
            </a>
          </>
        )}
      </nav>
    </aside>
  );
}
