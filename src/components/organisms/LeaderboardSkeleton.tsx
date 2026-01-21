import React from 'react';
import { cn } from '@/lib/utils';

const SkeletonItem = ({ className }: { className?: string }) => (
  <div className={cn('h-4 bg-gray-200 rounded animate-pulse', className)} />
);

const LeaderboardSkeleton = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="mb-4 text-lg font-semibold text-gray-700">Leaderboard</h3>
      <div className="space-y-3">
        <div className="flex items-center text-sm font-semibold text-gray-500">
          <div className="w-8">#</div>
          <div className="flex-1">Team</div>
          <div className="w-24 text-center">Solved</div>
          <div className="w-32 text-right">Time</div>
        </div>
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center p-2 rounded hover:bg-gray-50">
            <div className="w-8">
              <SkeletonItem className="w-1/2" />
            </div>
            <div className="flex items-center flex-1 space-x-2">
              <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
              <SkeletonItem className="w-3/4" />
            </div>
            <div className="w-24 text-center">
              <SkeletonItem className="w-1/2 mx-auto" />
            </div>
            <div className="w-32 text-right">
              <SkeletonItem className="w-3/4 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { LeaderboardSkeleton };