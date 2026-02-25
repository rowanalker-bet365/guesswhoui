import React from 'react';
import { render, screen } from '@testing-library/react';
import { MilestoneProgressItem } from '../MilestoneProgressItem';

// Mock child components
jest.mock('../../atoms/Icon', () => ({
  Icon: ({ name, className }: { name: string; className: string }) => (
    <div data-testid={`icon-${name}`} className={className} />
  ),
}));

describe('MilestoneProgressItem', () => {
  const defaultProps = {
    milestoneName: 'First Blood',
    status: 'not_started' as const,
  };

  it('renders milestone name', () => {
    render(<MilestoneProgressItem {...defaultProps} />);
    expect(screen.getByText('First Blood')).toBeInTheDocument();
  });

  it('renders completed status with Award icon', () => {
    render(<MilestoneProgressItem {...defaultProps} status="completed" timeTaken="5m" />);
    expect(screen.getByTestId('icon-Award')).toBeInTheDocument();
    expect(screen.getByText('5m')).toBeInTheDocument();
  });

  it('renders not_started status with placeholder', () => {
    render(<MilestoneProgressItem {...defaultProps} status="not_started" />);
    expect(screen.queryByTestId('icon-Award')).not.toBeInTheDocument();
    expect(screen.queryByText('5m')).not.toBeInTheDocument();
  });
});