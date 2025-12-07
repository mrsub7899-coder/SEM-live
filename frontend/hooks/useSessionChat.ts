"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { API_URL } from "../lib/api";

export function useSessionChat(sessionId: string, userId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const socket = io(API_URL);

  useEffect(() => {
    socket.emit("joinSession", { sessionId });

    socket.on("sessionMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionId]);

  function sendMessage(text: string) {
    socket.emit("sessionMessage", {
      sessionId,
      senderId: userId,
      text,
    });
  }

  return { messages, sendMessage };
}
