import React from 'react';

interface TeamColorDotProps {
  color: string;
}

const TeamColorDot: React.FC<TeamColorDotProps> = ({ color }) => {
  return (
    <div
      className="h-4 w-4 rounded-full border-2 border-white"
      style={{ backgroundColor: color }}
    />
  );
};

export { TeamColorDot };