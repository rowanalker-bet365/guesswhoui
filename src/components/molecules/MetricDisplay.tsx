import React from 'react';

interface MetricDisplayProps {
  label: string;
  value: string | number;
  className?: string;
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({ label, value, className }) => {
  return (
    <div className={`flex flex-col items-center justify-center rounded-lg bg-gray-100 p-4 ${className}`}>
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-2xl font-bold text-primary">{value}</span>
    </div>
  );
};

export { MetricDisplay };