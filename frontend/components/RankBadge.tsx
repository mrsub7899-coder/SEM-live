export function RankBadge({ level }: { level: number }) {
  let color = "gray";

  if (level >= 50) color = "cyan";
  else if (level >= 20) color = "purple";
  else if (level >= 10) color = "yellow";
  else if (level >= 5) color = "blue";

  return (
    <span className={`badge bg-${color}-600 text-white`}>
      Lv {level}
    </span>
  );
}