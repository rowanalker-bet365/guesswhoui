import React from 'react';
import { LeaderboardRow } from '../molecules/LeaderboardRow';
import { LeaderboardEntry } from '@/store/game-store';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const formatDuration = (ms: number) => {
    if (ms === 0) return 'N/A';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  return (
    <div className="w-full rounded-lg bg-brand p-4 text-white shadow">
      <h2 className="mb-4 text-center text-xl font-bold">Leaderboard</h2>
      <div className="grid grid-cols-12 items-center gap-2 px-2 text-center text-sm font-bold">
        <div className="col-span-1" /> {/* Rank - no header */}
        <div className="col-span-4 text-left">Team</div>
        <div className="col-span-2">Solves</div>
        <div className="col-span-3">Quickest Solve</div>
        <div className="col-span-2 font-semibold">Score</div>
      </div>
      <div className="mt-2 space-y-2">
        {entries.map((entry) => (
          <LeaderboardRow
            key={entry.teamName}
            rank={entry.rank}
            teamName={entry.teamName}
            solves={entry.solves}
            quickestSolve={formatDuration(entry.quickestSolve)}
            teamColor={entry.teamColor}
            score={entry.score}
          />
        ))}
      </div>
    </div>
  );
};

export { Leaderboard };