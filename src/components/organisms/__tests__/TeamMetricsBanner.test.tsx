import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TeamMetricsBanner } from '../TeamMetricsBanner';

// Mock child components
jest.mock('../../atoms/MetricDisplay', () => ({
  MetricDisplay: ({ label, value }: { label: string; value: string }) => (
    <div data-testid="metric-display">
      <span>{label}</span>: <span>{value}</span>
    </div>
  ),
}));
jest.mock('../../atoms/TeamColorDot', () => ({
  TeamColorDot: ({ color }: { color: string }) => (
    <div data-testid="team-dot" style={{ backgroundColor: color }} />
  ),
}));
jest.mock('../../atoms/Button', () => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled} data-testid="reset-button">
      {children}
    </button>
  ),
}));

describe('TeamMetricsBanner', () => {
  const defaultProps = {
    teamName: 'Team Alpha',
    teamColor: '#FF0000',
    teamId: 'team-123',
    sessionId: 'session-456',
    totalSolves: 5,
    fastestSolve: 120000, // 2 minutes
    challengeStartTime: '2023-01-01T10:00:00Z',
    runningTime: '00:10:00',
    totalScore: 500,
    onReset: jest.fn(),
    isResetting: false,
  };

  it('renders team information correctly', () => {
    render(<TeamMetricsBanner {...defaultProps} />);
    expect(screen.getByText('Team Alpha')).toBeInTheDocument();
    expect(screen.getByText('Team ID:')).toBeInTheDocument();
    expect(screen.getByText('team-123')).toBeInTheDocument();
    expect(screen.getByTestId('team-dot')).toHaveStyle({ backgroundColor: '#FF0000' });
  });

  it('renders metrics correctly', () => {
    render(<TeamMetricsBanner {...defaultProps} />);
    expect(screen.getByText('Total Score')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Total Solves')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Fastest Solve')).toBeInTheDocument();
    expect(screen.getByText('2m 0s')).toBeInTheDocument();
    
    // Check for Start Time
    expect(screen.getByText('Start Time')).toBeInTheDocument();
    expect(screen.getByText('Total Time')).toBeInTheDocument();
    expect(screen.getByText('00:10:00')).toBeInTheDocument();
  });

  it('renders session ID correctly', () => {
    render(<TeamMetricsBanner {...defaultProps} />);
    expect(screen.getByText('Active Session:')).toBeInTheDocument();
    expect(screen.getByText('session-456')).toBeInTheDocument();
  });

  it('calls onReset when reset button is clicked', () => {
    render(<TeamMetricsBanner {...defaultProps} />);
    const button = screen.getByTestId('reset-button');
    fireEvent.click(button);
    expect(defaultProps.onReset).toHaveBeenCalledTimes(1);
  });

  it('disables reset button when isResetting is true', () => {
    render(<TeamMetricsBanner {...defaultProps} isResetting={true} />);
    const button = screen.getByTestId('reset-button');
    expect(button).toBeDisabled();
    expect(screen.getByText('Resetting...')).toBeInTheDocument();
  });

  it('updates when metrics change', () => {
    const { rerender } = render(<TeamMetricsBanner {...defaultProps} />);
    
    // Initial check
    expect(screen.getByText('500')).toBeInTheDocument();
    
    // Update data
    const updatedProps = {
      ...defaultProps,
      totalScore: 600,
      totalSolves: 6,
    };
    
    rerender(<TeamMetricsBanner {...updatedProps} />);
    
    // Check if update is reflected
    expect(screen.getByText('600')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });
});