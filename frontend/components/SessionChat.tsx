"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSessionChat } from "../hooks/useSessionChat";

type Message = {
  id: string;
  text: string;
  createdAt: string;
  sender: { id: string; name: string | null; email: string };
};

export default function SessionChat({ sessionId }: { sessionId: string }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { messages, sendMessage, loadingInitial } = useSessionChat(
    sessionId,
    user?.id || ""
  );

  useEffect(() => {
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!user) return null;

  return (
    <div
      id="chat"
      className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col h-96"
    >
      <h2 className="text-lg font-semibold mb-2">Session Chat</h2>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {loadingInitial && (
          <p className="text-gray-500 text-sm">Loading messages...</p>
        )}

        {!loadingInitial && messages.length === 0 && (
          <p className="text-gray-500 text-sm">
            No messages yet. Start the conversation.
          </p>
        )}

        {messages.map((m: Message) => {
          const mine = m.sender.id === user.id;
          return (
            <div
              key={m.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  mine ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100"
                }`}
              >
                {!mine && (
                  <p className="text-xs text-gray-300 mb-1">
                    {m.sender.name || m.sender.email}
                  </p>
                )}
                <p>{m.text}</p>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          sendMessage(text.trim());
          setText("");
        }}
        className="mt-3 flex gap-2"
      >
        <input
          className="flex-1 px-3 py-2 rounded bg-black border border-gray-700 text-white text-sm"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm disabled:bg-gray-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}
