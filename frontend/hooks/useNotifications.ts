"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";

type Counts = { messages: number; tasks: number };

export function useNotifications() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      try {
        const data = await apiFetch("/notifications/overview");
        if (!cancelled) setCounts(data);
      } catch {
        if (!cancelled) setCounts(null);
      }
    }

    load();
    const interval = setInterval(load, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user]);

  return counts;
}
