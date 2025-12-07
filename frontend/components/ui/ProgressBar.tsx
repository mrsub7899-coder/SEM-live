import React from "react";

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.round((current / total) * 100);
  return (
    <div className="w-full bg-gray-200 rounded h-2 mb-4">
      <div
        className="bg-blue-600 h-2 rounded"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
