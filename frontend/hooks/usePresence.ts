"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { API_URL } from "../lib/api";

export function usePresence(userId: string) {
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const socket = io(API_URL, {
      query: { userId },
    });

    socket.on("presenceUpdate", ({ userId, isOnline }) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: isOnline,
      }));
    });

    return () => socket.disconnect();
  }, [userId]);

  return onlineUsers;
}
