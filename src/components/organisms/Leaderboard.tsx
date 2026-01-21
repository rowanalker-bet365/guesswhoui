import React from 'react';
import { LeaderboardRow } from '../molecules/LeaderboardRow';

interface LeaderboardEntry {
  rank: number;
  teamName: string;
  score: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  return (
    <div className="w-full max-w-md rounded-lg bg-white p-4 shadow">
      <h2 className="mb-4 text-center text-xl font-bold">Leaderboard</h2>
      <div className="space-y-2">
        {entries.map((entry) => (
          <LeaderboardRow
            key={entry.rank}
            rank={entry.rank}
            teamName={entry.teamName}
            score={entry.score}
          />
        ))}
      </div>
    </div>
  );
};

export { Leaderboard };