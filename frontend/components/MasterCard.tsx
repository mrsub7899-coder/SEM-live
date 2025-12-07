"use client";

import { RankBadge } from "./RankBadge";
import { usePresence } from "../hooks/usePresence";

type MasterCardProps = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl?: string | null;
  rankLevel: number;
};

export function MasterCard({
  id,
  name,
  email,
  avatarUrl,
  rankLevel,
}: MasterCardProps) {
  const presence = usePresence("master-card");
  const isOnline = presence[id] === true;

  return (
    <a
      href={`/masters/${id}`}
      className="card card-hover space-y-3 block"
    >
      {/* Avatar */}
      <img
        src={
          avatarUrl ||
          "https://api.dicebear.com/7.x/initials/svg?seed=" +
            (name || email)
        }
        className="w-full h-40 object-cover rounded-lg"
      />

      {/* Name + Level */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">{name || email}</p>
          <p className="text-gray-400 text-sm">{email}</p>
        </div>

        <RankBadge level={rankLevel} />
      </div>

      {/* Online status */}
      <p className="text-sm">
        {isOnline ? (
          <span className="text-green-400">● Online</span>
        ) : (
          <span className="text-gray-500">● Offline</span>
        )}
      </p>
    </a>
  );
}
