import React from 'react';
import { LeaderboardRow } from '../molecules/LeaderboardRow';
import { LeaderboardEntry } from '@/store/game-store';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  return (
    <div className="w-full max-w-md rounded-lg bg-brand p-4 text-white shadow">
      <h2 className="mb-4 text-center text-xl font-bold">Leaderboard</h2>
      <div className="grid grid-cols-12 items-center gap-2 px-2 text-center text-sm font-bold">
        <div className="col-span-1" /> {/* Rank - no header */}
        <div className="col-span-5 text-left">Team</div>
        <div className="col-span-3">Solves</div>
        <div className="col-span-3">Quickest Solve</div>
        <div className="col-span-3 font-semibold">Score</div>
      </div>
      <div className="mt-2 space-y-2">
        {entries.map((entry) => (
          <LeaderboardRow
            key={entry.teamName}
            rank={entry.rank}
            teamName={entry.teamName}
            solves={entry.solves}
            quickestSolve={String(entry.quickestSolve)}
            teamColor={entry.teamColor}
            score={entry.score}
          />
        ))}
      </div>
    </div>
  );
};

export { Leaderboard };