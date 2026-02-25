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
  // Ensure we always render a 64-item grid
  const gridItems = Array.from({ length: 64 }, (_, i) => characters[i] || null);

  return (
    <div className="grid grid-cols-8 gap-2 rounded-lg bg-brand p-4">
      {gridItems.map((char, index) => (
        <CharacterTile
          key={char ? char.id : `empty-${index}`}
          characterId={char ? char.id : `empty-${index}`}
          isSolved={char ? char.isSolved : false}
          imagePath={char ? char.imagePath : undefined}
          solvedByTeams={char ? char.solvedByTeams : []}
          displayMode={displayMode}
          totalTeams={totalTeams}
        />
      ))}
    </div>
  );
};

export { GameBoard };