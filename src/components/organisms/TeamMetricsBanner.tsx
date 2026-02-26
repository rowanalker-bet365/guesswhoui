import React from 'react';
import { MetricDisplay } from '../atoms/MetricDisplay';
import { TeamColorDot } from '../atoms/TeamColorDot';
import { Button } from '../atoms/Button';

interface TeamMetricsBannerProps {
  teamName: string;
  teamColor: string;
  teamId: string;
  sessionId: string;
  totalSolves: number;
  fastestSolve: number;
  challengeStartTime: string;
  runningTime: string;
  totalScore: number;
  onReset: () => void;
  isResetting: boolean;
}

const TeamMetricsBanner: React.FC<TeamMetricsBannerProps> = ({
  teamName,
  teamColor,
  teamId,
  sessionId,
  totalSolves,
  fastestSolve,
  challengeStartTime,
  runningTime,
  totalScore,
  onReset,
  isResetting,
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
      <div className="lg:col-span-1 flex flex-col items-center justify-center space-y-2">
        <div className="flex items-center justify-center">
          <TeamColorDot color={teamColor} />
          <h2 className="ml-4 text-2xl font-bold">{teamName}</h2>
        </div>
      </div>
      <MetricDisplay label="Total Score" value={String(totalScore)} />
      <MetricDisplay label="Total Solves" value={String(totalSolves)} />
      <MetricDisplay label="Fastest Solve" value={formatDuration(fastestSolve)} />
      <MetricDisplay label="Start Time" value={formatStartTime(challengeStartTime)} />
      <MetricDisplay label="Total Time" value={runningTime} />
      <div className="col-span-full mt-4 flex items-center justify-between border-t border-white/20 pt-4 lg:col-span-6">
        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="font-semibold opacity-75">Team ID:</span>{' '}
            <span className="font-mono">{teamId}</span>
          </div>
          <div>
            <span className="font-semibold opacity-75">Active Session:</span>{' '}
            <span className="font-mono">{sessionId || 'None'}</span>
          </div>
        </div>
        <Button
          onClick={onReset}
          variant="secondary"
          size="sm"
          disabled={isResetting}
          className="bg-white text-brand hover:bg-gray-100"
        >
          {isResetting ? 'Resetting...' : 'Reset Progress'}
        </Button>
      </div>
    </div>
  );
};

export { TeamMetricsBanner };