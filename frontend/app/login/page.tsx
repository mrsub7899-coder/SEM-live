// frontend/app/login/page.tsx
"use client";

import { useState } from "react";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      login(res.token, res.user);

      if (res.user.role === "MASTER") {
        router.push("/dashboard/master");
      } else {
        router.push("/dashboard/user");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold mb-6">Login</h1>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <label className="block mb-3">
          <span className="text-sm text-gray-300">Email</span>
          <input
            className="mt-1 w-full px-3 py-2 rounded bg-black border border-gray-700 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="block mb-5">
          <span className="text-sm text-gray-300">Password</span>
          <input
            type="password"
            className="mt-1 w-full px-3 py-2 rounded bg-black border border-gray-700 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-gray-400">
          No account?{" "}
          <a href="/register" className="text-blue-400 underline">
            Register
          </a>
        </p>
      </form>
    </main>
  );
}
