"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { NotificationPayload } from "../types/notifications";
import { useAuth } from "../context/AuthContext";

export function useNotificationsSocket(onEvent: (event: NotificationPayload) => void) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000", {
      transports: ["websocket"],
      query: { userId: user.id },
    });

    socket.on("notification", (event: NotificationPayload) => {
      onEvent(event);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, onEvent]);
}
