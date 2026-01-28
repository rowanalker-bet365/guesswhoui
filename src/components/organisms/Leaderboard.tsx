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
      <div className="grid grid-cols-5 items-center gap-2 text-center font-bold">
        <div className="col-span-2">Team</div>
        <div className="col-span-1">Solves</div>
        <div className="col-span-1">Fastest</div>
        <div className="col-span-1">Score</div>
      </div>
      <div className="mt-2 space-y-2">
        {entries.map((entry) => (
          <LeaderboardRow
            key={entry.rank}
            rank={entry.rank}
            teamName={entry.teamName}
            score={entry.score}
            solves={entry.solves}
            quickestSolve={entry.quickestSolve}
            teamColor={entry.teamColor}
          />
        ))}
      </div>
    </div>
  );
};

export { Leaderboard };