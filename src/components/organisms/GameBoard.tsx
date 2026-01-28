import React from 'react';
import { CharacterTile } from '../molecules/CharacterTile';
import { Character } from '@/store/game-store';

interface GameBoardProps {
  characters: Character[];
  displayMode: 'home' | 'team';
  totalTeams?: number;
}

const GameBoard: React.FC<GameBoardProps> = ({
  characters,
  displayMode,
  totalTeams,
}) => {
  return (
    <div className="grid grid-cols-8 gap-2 rounded-lg bg-brand p-4">
      {characters.map((char) => (
        <CharacterTile
          key={char.id}
          characterId={char.id}
          isSolved={char.isSolved}
          imageUrl={char.imageUrl}
          solvedByTeams={char.solvedByTeams}
          displayMode={displayMode}
          totalTeams={totalTeams}
        />
      ))}
    </div>
  );
};

export { GameBoard };