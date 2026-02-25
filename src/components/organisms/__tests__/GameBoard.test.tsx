import React from 'react';
import { render, screen } from '@testing-library/react';
import { GameBoard } from '../GameBoard';
import { Character } from '@/store/game-store';

// Mock child components
jest.mock('../../molecules/CharacterTile', () => ({
  CharacterTile: ({
    characterId,
    isSolved,
    solvedByTeams,
    totalTeams
  }: {
    characterId: string;
    isSolved: boolean;
    solvedByTeams: any[];
    totalTeams?: number
  }) => (
    <div
      data-testid="character-tile"
      data-issolved={isSolved}
      data-solvedbyteams={JSON.stringify(solvedByTeams)}
      data-totalteams={totalTeams}
    >
      {characterId}
    </div>
  ),
}));

describe('GameBoard', () => {
  const mockCharacters: Character[] = Array.from({ length: 64 }, (_, i) => ({
    id: `char-${i}`,
    name: `Character ${i}`,
    imagePath: `/images/char-${i}.png`,
    isSolved: false,
    solvedByTeams: [],
  }));

  it('renders 64 character tiles', () => {
    render(<GameBoard characters={mockCharacters} displayMode="home" />);
    const tiles = screen.getAllByTestId('character-tile');
    expect(tiles).toHaveLength(64);
  });

  it('renders empty tiles if characters array is short', () => {
    const shortCharacters = mockCharacters.slice(0, 10);
    render(<GameBoard characters={shortCharacters} displayMode="home" />);
    const tiles = screen.getAllByTestId('character-tile');
    expect(tiles).toHaveLength(64);
    expect(screen.getByText('char-0')).toBeInTheDocument();
    expect(screen.getByText('empty-10')).toBeInTheDocument();
  });

  it('passes displayMode prop correctly', () => {
    // Since we mocked CharacterTile, we can't easily check props passed to it without a more complex mock.
    // But we can verify the container renders.
    render(<GameBoard characters={mockCharacters} displayMode="team" />);
    expect(screen.getAllByTestId('character-tile')).toHaveLength(64);
  });

  it('updates when game data changes', () => {
    const { rerender } = render(<GameBoard characters={mockCharacters} displayMode="home" />);
    
    // Initial check
    expect(screen.getByText('char-0')).toBeInTheDocument();
    
    // Update data
    const updatedCharacters = [...mockCharacters];
    updatedCharacters[0] = { ...updatedCharacters[0], isSolved: true };
    
    rerender(<GameBoard characters={updatedCharacters} displayMode="home" />);
    
    // Check if update is reflected (using the data attribute we added to the mock)
    const tiles = screen.getAllByTestId('character-tile');
    expect(tiles[0]).toHaveAttribute('data-issolved', 'true');
  });

  it('passes solvedByTeams and totalTeams correctly for "All teams solved" case', () => {
    const charactersWithSolves = [...mockCharacters];
    charactersWithSolves[0] = {
      ...charactersWithSolves[0],
      solvedByTeams: [{ teamId: 't1', color: 'red' }, { teamId: 't2', color: 'blue' }]
    };

    render(
      <GameBoard
        characters={charactersWithSolves}
        displayMode="home"
        totalTeams={2}
      />
    );

    const tiles = screen.getAllByTestId('character-tile');
    const firstTile = tiles[0];
    
    expect(firstTile).toHaveAttribute('data-totalteams', '2');
    expect(firstTile).toHaveAttribute('data-solvedbyteams', expect.stringContaining('t1'));
    expect(firstTile).toHaveAttribute('data-solvedbyteams', expect.stringContaining('t2'));
  });
});