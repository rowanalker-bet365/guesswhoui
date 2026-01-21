import React from 'react';
import { MetricDisplay } from '../molecules/MetricDisplay';

interface TeamMetricsBannerProps {
  teamName: string;
  teamColor: string;
  currentStage: string;
  challengeStartTime: string;
  overallEfficiency: string;
  runningTime: string;
}

const TeamMetricsBanner: React.FC<TeamMetricsBannerProps> = ({
  teamName,
  teamColor,
  currentStage,
  challengeStartTime,
  overallEfficiency,
  runningTime,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-lg bg-white p-4 shadow md:grid-cols-3 lg:grid-cols-5">
      <div className="col-span-2 flex flex-col items-center justify-center md:col-span-3 lg:col-span-1">
        <h2 className="text-3xl font-bold" style={{ color: teamColor }}>
          {teamName}
        </h2>
      </div>
      <MetricDisplay label="Current Stage" value={currentStage} />
      <MetricDisplay label="Start Time" value={challengeStartTime} />
      <MetricDisplay label="Efficiency" value={overallEfficiency} />
      <MetricDisplay label="Total Time" value={runningTime} />
    </div>
  );
};

export { TeamMetricsBanner };