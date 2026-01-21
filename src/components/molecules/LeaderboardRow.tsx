import React from 'react';
import { Icon } from '../atoms/Icon';

interface LeaderboardRowProps {
  rank: number;
  teamName: string;
  score: number;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ rank, teamName, score }) => {
  const getRankIcon = () => {
    if (rank === 1) return <Icon name="Trophy" className="text-yellow-500" />;
    if (rank === 2) return <Icon name="Medal" className="text-gray-400" />;
    if (rank === 3) return <Icon name="Award" className="text-orange-400" />;
    return <span className="text-sm text-gray-500">{rank}</span>;
  };

  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-100 p-2">
      <div className="flex items-center space-x-2">
        {getRankIcon()}
        <span className="font-semibold">{teamName}</span>
      </div>
      <span className="font-bold text-primary">{score.toLocaleString()}</span>
    </div>
  );
};

export { LeaderboardRow };