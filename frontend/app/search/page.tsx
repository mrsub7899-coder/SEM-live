"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { MasterCard } from "../../components/MasterCard";
import { MasterCardSkeleton } from "../../components/MasterCardSkeleton";

type Master = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl?: string | null;
  rankLevel: number;
  sex?: "MALE" | "FEMALE" | "OTHER";
};

type SearchResponse = {
  results: Master[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export default function SearchPage() {
  const [masters, setMasters] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [nameFilter, setNameFilter] = useState("");
  const [sexFilter, setSexFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function loadMasters() {
    setLoading(true);

    const query = new URLSearchParams({
      page: page.toString(),
      pageSize: "18",
    });

    if (nameFilter.trim()) query.append("name", nameFilter.trim());
    if (sexFilter) query.append("sex", sexFilter);
    if (levelFilter) query.append("minLevel", levelFilter);

    const data: SearchResponse = await apiFetch(`/masters/search?${query.toString()}`);

    setMasters(data.results);
    setTotalPages(data.totalPages);
    setLoading(false);
  }

  useEffect(() => {
    loadMasters();
  }, [page, nameFilter, sexFilter, levelFilter]);

  return (
    <main className="page space-y-8">
      <h1 className="text-2xl font-semibold">Find a Master</h1>

      {/* Filters */}
      <section className="card space-y-4">
        <h2 className="text-lg font-semibold">Filters</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            className="input"
            placeholder="Search by name…"
            value={nameFilter}
            onChange={(e) => {
              setNameFilter(e.target.value);
              setPage(1);
            }}
          />

          <select
            className="input"
            value={sexFilter}
            onChange={(e) => {
              setSexFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Any Sex</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>

          <select
            className="input"
            value={levelFilter}
            onChange={(e) => {
              setLevelFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Any Level</option>
            <option value="5">Level 5+</option>
            <option value="10">Level 10+</option>
            <option value="20">Level 20+</option>
            <option value="50">Level 50+</option>
          </select>
        </div>
      </section>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <MasterCardSkeleton key={i} />
          ))}
        </div>
      ) : masters.length === 0 ? (
        <p className="text-gray-400 text-sm">No masters match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {masters.map((master) => (
            <MasterCard
              key={master.id}
              id={master.id}
              name={master.name}
              email={master.email}
              avatarUrl={master.avatarUrl}
              rankLevel={master.rankLevel}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            className="btn-secondary"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>

          <p className="text-gray-300">
            Page {page} of {totalPages}
          </p>

          <button
            className="btn-secondary"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
