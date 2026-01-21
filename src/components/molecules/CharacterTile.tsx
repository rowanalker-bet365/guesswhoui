import React from 'react';
import { Silhouette } from '../atoms/Silhouette';
import { CharacterImage } from '../atoms/CharacterImage';
import { TeamColorDot } from '../atoms/TeamColorDot';

interface CharacterTileProps {
  characterId: string;
  isSolved: boolean;
  imageUrl?: string;
  solvedByTeams?: { teamId: string; color: string }[];
}

const CharacterTile: React.FC<CharacterTileProps> = ({
  isSolved,
  imageUrl,
  solvedByTeams,
}) => {
  return (
    <div className="relative aspect-square w-full">
      {isSolved && imageUrl ? (
        <CharacterImage imageUrl={imageUrl} altText="Solved Character" />
      ) : (
        <Silhouette />
      )}
      <div className="absolute bottom-1 right-1 flex space-x-1">
        {solvedByTeams?.map((team) => (
          <TeamColorDot key={team.teamId} color={team.color} />
        ))}
      </div>
    </div>
  );
};

export { CharacterTile };