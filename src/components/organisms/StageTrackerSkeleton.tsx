import React from 'react';
import { cn } from '@/lib/utils';

const SkeletonItem = ({ className }: { className?: string }) => (
  <div className={cn('h-4 bg-gray-200 rounded animate-pulse', className)} />
);

const StageTrackerSkeleton = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="mb-4 text-lg font-semibold text-gray-700">
        Stage Progress
      </h3>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <SkeletonItem className="w-3/4" />
            </div>
            <SkeletonItem className="w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export { StageTrackerSkeleton };