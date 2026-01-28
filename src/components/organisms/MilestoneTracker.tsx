import React from 'react';
import { MilestoneProgressItem } from '../molecules/MilestoneProgressItem';
import { ALL_MILESTONES } from '@/lib/milestones';

interface CompletedMilestone {
  id: string;
  timeTaken: string;
}

interface MilestoneTrackerProps {
  completedMilestones: CompletedMilestone[];
}

const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ completedMilestones }) => {
  const completedMilestoneMap = new Map(
    completedMilestones.map((m) => [m.id, m.timeTaken])
  );

  return (
    <div className="w-full max-w-md rounded-lg bg-brand p-4 text-white shadow">
      <h2 className="mb-4 text-center text-xl font-bold">Milestone Progress</h2>
      <div>
        {ALL_MILESTONES.map((milestone) => {
          const timeTaken = completedMilestoneMap.get(milestone.id);
          const status = timeTaken ? 'completed' : 'not_started';

          return (
            <MilestoneProgressItem
              key={milestone.id}
              milestoneName={milestone.name}
              status={status}
              timeTaken={timeTaken}
            />
          );
        })}
      </div>
    </div>
  );
};

export { MilestoneTracker };