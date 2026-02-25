import React from 'react';
import { render, screen } from '@testing-library/react';
import { Leaderboard } from '../Leaderboard';
import { LeaderboardEntry } from '@/store/game-store';

// Mock child components
jest.mock('../../molecules/LeaderboardRow', () => ({
  LeaderboardRow: ({ teamName }: { teamName: string }) => (
    <div data-testid="leaderboard-row">{teamName}</div>
  ),
}));

describe('Leaderboard', () => {
  const mockEntries: LeaderboardEntry[] = [
    {
      rank: 1,
      teamName: 'Team Alpha',
      solves: 5,
      quickestSolve: 10000,
      teamColor: 'red',
      score: 100,
    },
    {
      rank: 2,
      teamName: 'Team Beta',
      solves: 3,
      quickestSolve: 20000,
      teamColor: 'blue',
      score: 50,
    },
  ];

  it('renders leaderboard title', () => {
    render(<Leaderboard entries={mockEntries} />);
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
  });

  it('renders correct number of rows', () => {
    render(<Leaderboard entries={mockEntries} />);
    const rows = screen.getAllByTestId('leaderboard-row');
    expect(rows).toHaveLength(2);
  });

  it('renders empty state correctly', () => {
    render(<Leaderboard entries={[]} />);
    expect(screen.queryByTestId('leaderboard-row')).not.toBeInTheDocument();
  });

  it('updates when leaderboard data changes', () => {
    const { rerender } = render(<Leaderboard entries={mockEntries} />);
    
    // Initial check
    expect(screen.getAllByTestId('leaderboard-row')).toHaveLength(2);
    expect(screen.getByText('Team Alpha')).toBeInTheDocument();
    
    // Update data
    const updatedEntries = [
      ...mockEntries,
      {
        rank: 3,
        teamName: 'Team Gamma',
        solves: 1,
        quickestSolve: 30000,
        teamColor: 'green',
        score: 20,
      },
    ];
    
    rerender(<Leaderboard entries={updatedEntries} />);
    
    // Check if update is reflected
    expect(screen.getAllByTestId('leaderboard-row')).toHaveLength(3);
    expect(screen.getByText('Team Gamma')).toBeInTheDocument();
  });

  it('renders entries in the order provided', () => {
    // The component itself doesn't sort, but we should verify it respects the order
    const reversedEntries = [...mockEntries].reverse();
    render(<Leaderboard entries={reversedEntries} />);
    
    const rows = screen.getAllByTestId('leaderboard-row');
    expect(rows[0]).toHaveTextContent('Team Beta');
    expect(rows[1]).toHaveTextContent('Team Alpha');
  });
});