import React from 'react';
import { CharacterTile } from '../molecules/CharacterTile';
import { useSolvedCharacters } from '@/hooks/useSolvedCharacters';
import { Character } from '@/store/game-store';

const SolvedCharactersGrid: React.FC = () => {
  const { solvedCharacters, isLoading } = useSolvedCharacters();

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-gray-200 rounded-lg"></div>;
  }

  if (solvedCharacters.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow">
        <p>No characters solved yet. Keep playing!</p>
      </div>
    );
  }

  // Map ApiCharacter to Character, ensuring isSolved is true
  const characters: Character[] = solvedCharacters.map((char) => ({
    ...char,
    isSolved: true,
  }));

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Collection</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 rounded-lg bg-brand-light p-4">
        {characters.map((char) => (
          <CharacterTile
            key={char.id}
            characterId={char.id}
            isSolved={true}
            imageUrl={char.imageUrl}
            solvedByTeams={char.solvedByTeams}
            displayMode="team"
          />
        ))}
      </div>
    </div>
  );
};

export { SolvedCharactersGrid };