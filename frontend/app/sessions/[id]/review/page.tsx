"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "../../../../lib/api";
import { useAuth } from "../../../../context/AuthContext";
import MasterReview from "../../../../components/MasterReview";
import SessionHeader from "../../../../components/SessionHeader";
import SessionSideNav from "../../../../components/SessionSideNav";

export default function SessionReviewPage() {
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
        <p className="text-gray-400">Only masters can review sessions.</p>
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
        <MasterReview sessionId={sessionId} />
      </div>
    </main>
  );
}
