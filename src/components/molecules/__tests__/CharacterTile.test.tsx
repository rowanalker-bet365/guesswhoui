import React from 'react';
import { render, screen } from '@testing-library/react';
import { CharacterTile } from '../CharacterTile';

// Mock child components
jest.mock('../../atoms/Silhouette', () => ({
  Silhouette: () => <div data-testid="silhouette" />,
}));
jest.mock('../../atoms/CharacterImage', () => ({
  CharacterImage: ({ imagePath, altText }: { imagePath: string; altText: string }) => (
    <img src={imagePath} alt={altText} data-testid="character-image" />
  ),
}));
jest.mock('../../atoms/TeamColorDot', () => ({
  TeamColorDot: ({ color }: { color: string }) => (
    <div data-testid="team-dot" style={{ backgroundColor: color }} />
  ),
}));

describe('CharacterTile', () => {
  const defaultProps = {
    characterId: 'char-1',
    isSolved: false,
    displayMode: 'team' as const,
  };

  it('renders Silhouette when not solved (no imagePath)', () => {
    render(<CharacterTile {...defaultProps} />);
    expect(screen.getByTestId('silhouette')).toBeInTheDocument();
    expect(screen.queryByTestId('character-image')).not.toBeInTheDocument();
  });

  it('renders CharacterImage when solved (has imagePath) in team mode', () => {
    render(
      <CharacterTile
        {...defaultProps}
        displayMode="team"
        isSolved={true}
        imagePath="/images/char-1.png"
      />
    );
    expect(screen.getByTestId('character-image')).toBeInTheDocument();
    expect(screen.getByTestId('character-image')).toHaveAttribute(
      'src',
      '/images/char-1.png'
    );
    expect(screen.queryByTestId('silhouette')).not.toBeInTheDocument();
  });

  it('renders Silhouette in home mode when partially solved (even if imagePath is present)', () => {
    const solvedByTeams = [{ teamId: 'team-1', color: 'red' }];
    render(
      <CharacterTile
        {...defaultProps}
        displayMode="home"
        isSolved={true}
        imagePath="/images/char-1.png"
        solvedByTeams={solvedByTeams}
        totalTeams={2}
      />
    );
    expect(screen.getByTestId('silhouette')).toBeInTheDocument();
    expect(screen.queryByTestId('character-image')).not.toBeInTheDocument();
  });

  it('renders CharacterImage in home mode when fully solved', () => {
    const solvedByTeams = [
      { teamId: 'team-1', color: 'red' },
      { teamId: 'team-2', color: 'blue' },
    ];
    render(
      <CharacterTile
        {...defaultProps}
        displayMode="home"
        isSolved={true}
        imagePath="/images/char-1.png"
        solvedByTeams={solvedByTeams}
        totalTeams={2}
      />
    );
    expect(screen.getByTestId('character-image')).toBeInTheDocument();
    expect(screen.queryByTestId('silhouette')).not.toBeInTheDocument();
  });

  it('renders team dots in home mode when partially solved', () => {
    const solvedByTeams = [
      { teamId: 'team-1', color: 'red' },
      { teamId: 'team-2', color: 'blue' },
    ];
    render(
      <CharacterTile
        {...defaultProps}
        displayMode="home"
        solvedByTeams={solvedByTeams}
        totalTeams={5}
      />
    );
    const dots = screen.getAllByTestId('team-dot');
    expect(dots).toHaveLength(2);
  });

  it('does not render team dots in home mode when fully solved', () => {
    const solvedByTeams = [
      { teamId: 'team-1', color: 'red' },
      { teamId: 'team-2', color: 'blue' },
    ];
    render(
      <CharacterTile
        {...defaultProps}
        displayMode="home"
        solvedByTeams={solvedByTeams}
        totalTeams={2} // Fully solved
      />
    );
    expect(screen.queryByTestId('team-dot')).not.toBeInTheDocument();
  });

  it('does not render team dots in team mode', () => {
    const solvedByTeams = [{ teamId: 'team-1', color: 'red' }];
    render(
      <CharacterTile
        {...defaultProps}
        displayMode="team"
        solvedByTeams={solvedByTeams}
      />
    );
    expect(screen.queryByTestId('team-dot')).not.toBeInTheDocument();
  });
});