import React from 'react';
import { Icon } from '../atoms/Icon';
import { TeamColorDot } from '../atoms/TeamColorDot';

interface LeaderboardRowProps {
  rank: number;
  teamName: string;
  solves: number;
  quickestSolve: string;
  teamColor: string;
  score: number;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({
  rank,
  teamName,
  solves,
  quickestSolve,
  teamColor,
  score,
}) => {
  const getRankIcon = () => {
    const commonClassName = "h-6 w-6 flex-shrink-0";
    if (rank === 1) return <Icon name="Trophy" className={`text-yellow-500 ${commonClassName}`} />;
    if (rank === 2) return <Icon name="Medal" className={`text-gray-400 ${commonClassName}`} />;
    if (rank === 3) return <Icon name="Award" className={`text-orange-400 ${commonClassName}`} />;
    return <span className={`flex items-center justify-center text-sm text-gray-200 ${commonClassName}`}>{rank}</span>;
  };

  return (
    <div className="grid grid-cols-12 items-center gap-2 rounded-lg bg-brand-hover p-2 text-center text-sm text-white">
      <div className="col-span-1 flex items-center justify-center">{getRankIcon()}</div>
      <div className="col-span-5 flex items-center space-x-2 text-left">
        <TeamColorDot color={teamColor} />
        <span className="truncate font-semibold">{teamName}</span>
      </div>
      <span className="col-span-3 font-semibold">{solves}</span>
      <span className="col-span-3 font-semibold">{quickestSolve}</span>
      <span className="col-span-3 font-bold">{score}</span>
    </div>
  );
};

export { LeaderboardRow };