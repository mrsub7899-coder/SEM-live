"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications";
import { apiFetch } from "../lib/api";
import { useNotificationsSocket } from "../hooks/useNotificationsSocket";
import { NotificationPayload } from "../types/notifications";

export default function TopNav() {
  const { user, logout } = useAuth();
  const counts = useNotifications();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);

  const notifTotal = (counts?.messages ?? 0) + (counts?.tasks ?? 0);
  const initials =
    user?.email?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || "?";

  useEffect(() => {
    if (!user) return;
    apiFetch("/notifications/overview")
      .then((res) => {
        const initial: NotificationPayload[] = [
          ...res.messages.map((m: any) => ({
            type: "message",
            text: m.text,
            createdAt: m.createdAt,
          })),
          ...res.tasks.map((t: any) => ({
            type: "task",
            title: t.title,
            createdAt: t.createdAt,
          })),
          ...res.sessions.map((s: any) => ({
            type: "session",
            sessionId: s.id,
            master: s.master,
            user: s.user,
            createdAt: s.createdAt,
          })),
          { type: "rank", rank: res.rank, createdAt: new Date().toISOString() },
        ];
        setNotifications(initial);
      })
      .catch((err) => console.error("Failed to load notifications", err));
  }, [user]);

  useNotificationsSocket((event) => {
    setNotifications((prev) => [event, ...prev]);
  });

  return (
    <nav className="w-full border-b border-gray-800 bg-black/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold text-white">
            Slave Exchange Market
          </Link>

          <div className="hidden md:flex items-center gap-4 text-sm text-gray-300">
            <Link href="/search" className="hover:text-white">
              Find Doms
            </Link>
            <Link href="/chat/inbox" className="hover:text-white">
              Chat
            </Link>
            <Link href="/offerings" className="hover:text-white">
              Offerings
            </Link>
            <Link href="/forum" className="hover:text-white">
              The Forum
            </Link>
            <Link href="/submit" className="hover:text-white">
              Submit
            </Link>

            {user?.role === "USER" && (
              <Link href="/dashboard/user" className="hover:text-white">
                My Dashboard
              </Link>
            )}

            {user?.role === "MASTER" && (
              <>
                <Link href="/dashboard/master" className="hover:text-white">
                  Master Dashboard
                </Link>
                <Link
                  href="/dashboard/master/templates"
                  className="hover:text-white"
                >
                  Templates
                </Link>
              </>
            )}
          </div>
        </div>

        {/* ✅ Conditional rendering for auth */}
        {user && user.id ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm text-white">
                {initials}
              </div>
              <button
                onClick={logout}
                className="text-xs text-gray-400 hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm">
            <Link href="/login" className="text-gray-300 hover:text-white">
              Login
            </Link>
            <Link
              href="/register"
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white"
            >
              Sign up
            </Link>
			<div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="relative p-2 rounded hover:bg-gray-700"
          >
            🔔
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-xs rounded-full px-1">
                {notifications.length}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-80 bg-white text-black shadow-lg rounded p-4 z-50">
              <h2 className="font-semibold mb-2">Notifications</h2>
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n, idx) => (
                  <li key={idx} className="text-sm border-b pb-1">
                    {n.type === "message" && <>💬 {n.text}</>}
                    {n.type === "task" && <>📋 Task: {n.title}</>}
                    {n.type === "session" && (
                      <>📅 Session with {n.master?.name ?? n.master?.email}</>
                    )}
                    {n.type === "rank" && (
                      <>⭐ Rank Level {n.rank?.level} ({n.rank?.points} pts)</>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
          </div>
        )}
        
      </div>
    </nav>
  );
}
