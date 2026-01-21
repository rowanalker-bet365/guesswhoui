import React from 'react';
import { StageProgressItem } from '../molecules/StageProgressItem';

type StageStatus = 'completed' | 'in_progress' | 'not_started';

interface Stage {
  name: string;
  status: StageStatus;
  timeTaken?: string;
}

interface StageTrackerProps {
  stages: Stage[];
}

const StageTracker: React.FC<StageTrackerProps> = ({ stages }) => {
  return (
    <div className="w-full max-w-md rounded-lg bg-white p-4 shadow">
      <h2 className="mb-4 text-center text-xl font-bold">Challenge Progress</h2>
      <div className="divide-y divide-gray-200">
        {stages.map((stage) => (
          <StageProgressItem
            key={stage.name}
            stageName={stage.name}
            status={stage.status}
            timeTaken={stage.timeTaken}
          />
        ))}
      </div>
    </div>
  );
};

export { StageTracker };