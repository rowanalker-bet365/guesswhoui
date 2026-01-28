import React from 'react';
import { MetricDisplay } from '../molecules/MetricDisplay';
import { TeamColorDot } from '../atoms/TeamColorDot';

interface TeamMetricsBannerProps {
  teamName: string;
  teamColor: string;
  totalSolves: number;
  fastestSolve: number;
  challengeStartTime: string;
  runningTime: string;
  totalScore: number;
}

const TeamMetricsBanner: React.FC<TeamMetricsBannerProps> = ({
  teamName,
  teamColor,
  totalSolves,
  fastestSolve,
  challengeStartTime,
  runningTime,
  totalScore,
}) => {
  const formatStartTime = (time: string) => {
    if (!time || time === 'N/A') return 'N/A';
    try {
      const date = new Date(time);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return 'N/A';
    }
  };

  const formatDuration = (ms: number) => {
    if (ms === 0) return 'N/A';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 rounded-lg bg-brand p-4 text-white shadow">
      <div className="lg:col-span-1 flex items-center justify-center">
        <TeamColorDot color={teamColor} />
        <h2 className="ml-4 text-2xl font-bold">{teamName}</h2>
      </div>
      <MetricDisplay label="Total Score" value={String(totalScore)} />
      <MetricDisplay label="Total Solves" value={String(totalSolves)} />
      <MetricDisplay label="Fastest Solve" value={formatDuration(fastestSolve)} />
      <MetricDisplay label="Start Time" value={formatStartTime(challengeStartTime)} />
      <MetricDisplay label="Total Time" value={runningTime} />
    </div>
  );
};

export { TeamMetricsBanner };