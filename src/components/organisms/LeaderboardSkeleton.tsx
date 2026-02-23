import React from 'react';
import { cn } from '@/lib/utils';

const SkeletonItem = ({ className }: { className?: string }) => (
  <div className={cn('h-4 bg-gray-200 rounded animate-pulse', className)} />
);

const LeaderboardSkeleton = () => {
  return (
    <div className="w-full max-w-md rounded-lg bg-brand p-4 text-white shadow">
      <h2 className="mb-4 text-center text-xl font-bold">Leaderboard</h2>
      <div className="grid grid-cols-12 items-center gap-2 px-2 text-center text-sm font-bold">
        <div className="col-span-1" /> {/* Rank - no header */}
        <div className="col-span-5 text-left">Team</div>
        <div className="col-span-3">Solves</div>
        <div className="col-span-3">Quickest Solve</div>
        <div className="col-span-3 font-semibold">Score</div>
      </div>
      <div className="mt-2 space-y-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-12 items-center gap-2 rounded-lg bg-brand-hover p-2 text-center text-sm text-white"
          >
            <div className="col-span-1 flex items-center justify-center">
              <SkeletonItem className="h-6 w-6" />
            </div>
            <div className="col-span-5 flex items-center space-x-2 text-left">
              <SkeletonItem className="h-4 w-4 rounded-full" />
              <SkeletonItem className="h-4 w-3/4" />
            </div>
            <div className="col-span-3">
              <SkeletonItem className="mx-auto h-4 w-1/2" />
            </div>
            <div className="col-span-3">
              <SkeletonItem className="mx-auto h-4 w-1/2" />
            </div>
            <div className="col-span-3">
              <SkeletonItem className="mx-auto h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { LeaderboardSkeleton };