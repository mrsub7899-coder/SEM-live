"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../lib/api";

type User = {
  id: string;
  email: string;
  role: "USER" | "MASTER";
  name?: string;
  credits?: number;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    apiFetch("/auth/profile")
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  }, []);

  // Register
  const register = useCallback(
    async (email: string, password: string, name: string, role: "USER" | "MASTER" = "USER") => {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, name, role }),
      });
      return data.user;
    },
    []
  );

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}
