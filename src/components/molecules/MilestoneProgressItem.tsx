import React from 'react';
import { Icon } from '../atoms/Icon';

type MilestoneStatus = 'completed' | 'not_started';

interface MilestoneProgressItemProps {
  milestoneName: string;
  status: MilestoneStatus;
  timeTaken?: string;
}

const MilestoneProgressItem: React.FC<MilestoneProgressItemProps> = ({
  milestoneName,
  status,
  timeTaken,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <Icon name="Award" className="text-yellow-500" />;
      case 'not_started':
        return <div className="h-6 w-6" />; // Placeholder for alignment
      default:
        return null;
    }
  };

  return (
    <div className="mb-2 flex items-center justify-between rounded-lg bg-brand-hover p-2 text-white last:mb-0">
      <div className="flex items-center space-x-3">
        {getStatusIcon()}
        <span className="text-lg">{milestoneName}</span>
      </div>
      {timeTaken && <span className="text-sm text-gray-200">{timeTaken}</span>}
    </div>
  );
};

export { MilestoneProgressItem };