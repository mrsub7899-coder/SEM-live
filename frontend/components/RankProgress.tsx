export function RankProgress({ rankPoints, rankLevel }) {
  const nextLevelRP = (rankLevel + 1) * (rankLevel + 1) * 50;
  const progress = Math.min((rankPoints / nextLevelRP) * 100, 100);

  return (
    <div className="w-full bg-gray-800 rounded h-2 mt-2">
      <div
        className="bg-brand h-2 rounded"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}