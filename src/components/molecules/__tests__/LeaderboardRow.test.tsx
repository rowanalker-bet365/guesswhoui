import React from 'react';
import { render, screen } from '@testing-library/react';
import { LeaderboardRow } from '../LeaderboardRow';

// Mock child components
jest.mock('../../atoms/Icon', () => ({
  Icon: ({ name, className }: { name: string; className: string }) => (
    <div data-testid={`icon-${name}`} className={className} />
  ),
}));
jest.mock('../../atoms/TeamColorDot', () => ({
  TeamColorDot: ({ color }: { color: string }) => (
    <div data-testid="team-dot" style={{ backgroundColor: color }} />
  ),
}));

describe('LeaderboardRow', () => {
  const defaultProps = {
    rank: 1,
    teamName: 'Team Alpha',
    solves: 5,
    quickestSolve: '2m 30s',
    teamColor: '#FF0000',
    score: 100,
  };

  it('renders rank 1 with Trophy icon', () => {
    render(<LeaderboardRow {...defaultProps} rank={1} />);
    expect(screen.getByTestId('icon-Trophy')).toBeInTheDocument();
    expect(screen.getByText('Team Alpha')).toBeInTheDocument();
  });

  it('renders rank 2 with Medal icon', () => {
    render(<LeaderboardRow {...defaultProps} rank={2} />);
    expect(screen.getByTestId('icon-Medal')).toBeInTheDocument();
  });

  it('renders rank 3 with Award icon', () => {
    render(<LeaderboardRow {...defaultProps} rank={3} />);
    expect(screen.getByTestId('icon-Award')).toBeInTheDocument();
  });

  it('renders rank 4 as text', () => {
    render(<LeaderboardRow {...defaultProps} rank={4} />);
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.queryByTestId(/icon-/)).not.toBeInTheDocument();
  });

  it('renders team details correctly', () => {
    render(<LeaderboardRow {...defaultProps} />);
    expect(screen.getByText('Team Alpha')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Solves
    expect(screen.getByText('2m 30s')).toBeInTheDocument(); // Quickest Solve
    expect(screen.getByText('100')).toBeInTheDocument(); // Score
    expect(screen.getByTestId('team-dot')).toHaveStyle({ backgroundColor: '#FF0000' });
  });
});