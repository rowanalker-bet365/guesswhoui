import React from 'react';
import { Icon } from '../atoms/Icon';
import { Loader } from '../atoms/Loader';

type StageStatus = 'completed' | 'in_progress' | 'not_started';

interface StageProgressItemProps {
  stageName: string;
  status: StageStatus;
  timeTaken?: string;
}

const StageProgressItem: React.FC<StageProgressItemProps> = ({
  stageName,
  status,
  timeTaken,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <Icon name="Award" className="text-green-500" />;
      case 'in_progress':
        return <Loader loading={true} />;
      case 'not_started':
        return <div className="h-6 w-6" />; // Placeholder for alignment
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center space-x-3">
        {getStatusIcon()}
        <span className={`text-lg ${status === 'not_started' ? 'text-gray-400' : ''}`}>
          {stageName}
        </span>
      </div>
      {timeTaken && <span className="text-sm text-gray-500">{timeTaken}</span>}
    </div>
  );
};

export { StageProgressItem };