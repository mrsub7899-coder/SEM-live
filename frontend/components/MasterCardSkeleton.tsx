export function MasterCardSkeleton() {
  return (
    <div className="card space-y-3 animate-pulse">
      {/* Avatar placeholder */}
      <div className="w-full h-40 bg-gray-800 rounded-lg" />

      {/* Name + badge placeholder */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-700 rounded" />
          <div className="h-3 w-24 bg-gray-700 rounded" />
        </div>
        <div className="h-6 w-12 bg-gray-700 rounded" />
      </div>

      {/* Online status placeholder */}
      <div className="h-3 w-16 bg-gray-700 rounded" />
    </div>
  );
}
