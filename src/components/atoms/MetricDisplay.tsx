import React from 'react';

interface MetricDisplayProps {
  label: string;
  value: string | number;
  className?: string;
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({ label, value, className }) => {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <span className="text-sm font-medium opacity-80">{label}</span>
      <span className="mt-1 text-2xl font-bold">{value}</span>
    </div>
  );
};

export { MetricDisplay };