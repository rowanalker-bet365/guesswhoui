import React from 'react';
import { Silhouette } from '../atoms/Silhouette';
import { CharacterImage } from '../atoms/CharacterImage';
import { TeamColorDot } from '../atoms/TeamColorDot';

interface CharacterTileProps {
  characterId: string;
  isSolved: boolean;
  imageUrl?: string;
  solvedByTeams?: { teamId: string; color: string }[];
  displayMode: 'home' | 'team';
  totalTeams?: number;
}

const CharacterTile: React.FC<CharacterTileProps> = ({
  isSolved,
  imageUrl,
  solvedByTeams = [],
  displayMode,
  totalTeams,
}) => {
  const isFullySolved =
    displayMode === 'home' && totalTeams
      ? solvedByTeams.length === totalTeams
      : false;

  const showImage =
    (displayMode === 'team' && isSolved) || (displayMode === 'home' && isFullySolved);

  return (
    <div className="relative aspect-square w-full">
      {showImage && imageUrl ? (
        <CharacterImage imageUrl={imageUrl} altText="Solved Character" />
      ) : (
        <Silhouette />
      )}
      {displayMode === 'home' && !isFullySolved && (
        <div className="absolute inset-x-1 top-1 flex flex-wrap justify-end gap-1">
          {[...solvedByTeams].reverse().map((team) => (
            <TeamColorDot key={team.teamId} color={team.color} />
          ))}
        </div>
      )}
    </div>
  );
};

export { CharacterTile };