import React from 'react';
import { render, screen } from '@testing-library/react';
import { MilestoneTracker } from '../MilestoneTracker';
import { ALL_MILESTONES } from '@/lib/milestones';

// Mock child components
jest.mock('../../molecules/MilestoneProgressItem', () => ({
  MilestoneProgressItem: ({ milestoneName, status }: { milestoneName: string; status: string }) => (
    <div data-testid="milestone-item">
      <span>{milestoneName}</span>
      <span>{status}</span>
    </div>
  ),
}));

describe('MilestoneTracker', () => {
  const completedMilestones = [
    { id: ALL_MILESTONES[0].id, timeTaken: '5m' },
  ];

  it('renders all milestones', () => {
    render(<MilestoneTracker completedMilestones={completedMilestones} />);
    const items = screen.getAllByTestId('milestone-item');
    expect(items).toHaveLength(ALL_MILESTONES.length);
  });

  it('marks completed milestones correctly', () => {
    render(<MilestoneTracker completedMilestones={completedMilestones} />);
    const firstMilestone = screen.getAllByTestId('milestone-item')[0];
    expect(firstMilestone).toHaveTextContent(ALL_MILESTONES[0].name);
    expect(firstMilestone).toHaveTextContent('completed');
  });

  it('marks uncompleted milestones correctly', () => {
    render(<MilestoneTracker completedMilestones={completedMilestones} />);
    const secondMilestone = screen.getAllByTestId('milestone-item')[1];
    expect(secondMilestone).toHaveTextContent(ALL_MILESTONES[1].name);
    expect(secondMilestone).toHaveTextContent('not_started');
  });

  it('updates when milestones are completed', () => {
    const { rerender } = render(<MilestoneTracker completedMilestones={completedMilestones} />);
    
    // Initial check: second milestone is not started
    const items = screen.getAllByTestId('milestone-item');
    expect(items[1]).toHaveTextContent('not_started');
    
    // Update data: complete the second milestone
    const updatedMilestones = [
      ...completedMilestones,
      { id: ALL_MILESTONES[1].id, timeTaken: '10m' },
    ];
    
    rerender(<MilestoneTracker completedMilestones={updatedMilestones} />);
    
    // Check if update is reflected
    const updatedItems = screen.getAllByTestId('milestone-item');
    expect(updatedItems[1]).toHaveTextContent('completed');
  });
});