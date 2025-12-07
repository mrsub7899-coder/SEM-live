"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "../../../../lib/api";
import { useAuth } from "../../../../context/AuthContext";

export default function GlobalChatThread() {
  const params = useParams();
  const otherId = params?.id as string;
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  async function load() {
    const data = await apiFetch("/global-chat/thread", {
      method: "POST",
      body: JSON.stringify({ masterId: user.role === "USER" ? otherId : user.id }),
    });
    setMessages(data);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  async function send() {
    await apiFetch("/global-chat/messages", {
      method: "POST",
      body: JSON.stringify({
        masterId: user.role === "USER" ? otherId : user.id,
        text,
      }),
    });
    setText("");
    load();
  }

  return (
    <main className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">Chat</h1>

      <div className="space-y-3">
        {messages.map((m: any) => (
          <div
            key={m.id}
            className={`flex ${
              m.senderId === user.id ? "justify-end" : "justify-start"
            }`}
          >
            <div className="px-3 py-2 bg-gray-800 rounded max-w-xs">
              <p className="text-sm">{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 bg-black border border-gray-700 rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={send}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Send
        </button>
      </div>
    </main>
  );
}
