import React from 'react';
import { CharacterTile } from '../molecules/CharacterTile';

// This would come from your API in a real scenario
interface Character {
  id: string;
  isSolved: boolean;
  imageUrl?: string;
  solvedByTeams?: { teamId: string; color: string }[];
}

interface GameBoardProps {
  characters: Character[];
}

const GameBoard: React.FC<GameBoardProps> = ({ characters }) => {
  return (
    <div className="grid grid-cols-8 gap-2 rounded-lg bg-gray-200 p-4">
      {characters.map((char) => (
        <CharacterTile
          key={char.id}
          characterId={char.id}
          isSolved={char.isSolved}
          imageUrl={char.imageUrl}
          solvedByTeams={char.solvedByTeams}
        />
      ))}
    </div>
  );
};

export { GameBoard };