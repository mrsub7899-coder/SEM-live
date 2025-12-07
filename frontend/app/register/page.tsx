// frontend/app/register/page.tsx
"use client";

import { useState } from "react";
import { apiFetch } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"USER" | "MASTER">("USER");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, name, role }),
      });

      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold mb-6">Register</h1>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <label className="block mb-3">
          <span className="text-sm text-gray-300">Name</span>
          <input
            className="mt-1 w-full px-3 py-2 rounded bg-black border border-gray-700 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm text-gray-300">Email</span>
          <input
            className="mt-1 w-full px-3 py-2 rounded bg-black border border-gray-700 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm text-gray-300">Password</span>
          <input
            type="password"
            className="mt-1 w-full px-3 py-2 rounded bg-black border border-gray-700 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <div className="mb-5">
          <span className="text-sm text-gray-300">Role</span>
          <div className="mt-2 flex gap-4">
            <button
              type="button"
              onClick={() => setRole("USER")}
              className={`px-3 py-1 rounded border ${
                role === "USER"
                  ? "bg-blue-600 border-blue-500"
                  : "bg-black border-gray-700"
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setRole("MASTER")}
              className={`px-3 py-1 rounded border ${
                role === "MASTER"
                  ? "bg-blue-600 border-blue-500"
                  : "bg-black border-gray-700"
              }`}
            >
              Master
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 underline">
            Login
          </a>
        </p>
      </form>
    </main>
  );
}
