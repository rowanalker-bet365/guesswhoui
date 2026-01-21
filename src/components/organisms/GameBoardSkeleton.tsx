import React from 'react';

const GameBoardSkeleton = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-8 gap-2">
        {[...Array(64)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-200 rounded animate-pulse"
          />
        ))}
      </div>
    </div>
  );
};

export { GameBoardSkeleton };