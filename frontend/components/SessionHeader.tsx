"use client";

import { useAuth } from "../context/AuthContext";

export default function SessionHeader({
  session,
  sessionId,
}: {
  session: any;
  sessionId: string;
}) {
  const { user } = useAuth();

  return (
    <header className="mb-8 border-b border-gray-800 pb-4">
      <div className="flex items-center justify-between">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <a
            href={user?.role === "MASTER" ? "/dashboard/master" : "/dashboard/user"}
            className="hover:text-white transition"
          >
            Dashboard
          </a>
          <span className="text-gray-600">/</span>

          <a
            href={
              user?.role === "MASTER"
                ? "/dashboard/master/my-sessions"
                : "/dashboard/user/my-sessions"
            }
            className="hover:text-white transition"
          >
            Sessions
          </a>
          <span className="text-gray-600">/</span>

          <span className="text-gray-300">
            Session {sessionId.slice(0, 6)}…
          </span>
        </div>

        {/* Back button */}
        <a
          href={user?.role === "MASTER" ? "/dashboard/master" : "/dashboard/user"}
          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-sm text-gray-300 hover:text-white transition"
        >
          Back to Dashboard
        </a>
      </div>

      {/* Session Title */}
      <div className="mt-4">
        <h1 className="text-2xl font-semibold text-white">
          Session with{" "}
          {user?.role === "MASTER"
            ? session.user?.name || "User"
            : session.master?.name || "Master"}
        </h1>

        <p className="text-gray-400 text-sm mt-1">
          Status:{" "}
          <span
            className={
              session.status === "ACTIVE"
                ? "text-green-400"
                : "text-gray-400"
            }
          >
            {session.status}
          </span>
        </p>
      </div>
    </header>
  );
}
