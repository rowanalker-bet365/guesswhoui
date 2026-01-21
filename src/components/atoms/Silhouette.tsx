import React from 'react';
import { Icon } from './Icon';

const Silhouette: React.FC = () => {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-300">
      <Icon name="User" size={48} className="text-gray-500" />
    </div>
  );
};

export { Silhouette };