import { useState, useEffect } from 'react';

const formatTime = (totalSeconds: number): string => {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return '00:00:00';
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (num: number) => num.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

const useTimer = (startTime: string | null | undefined): string => {
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => {
    if (!startTime) {
      setElapsedTime('00:00:00');
      return;
    }

    const startTimestamp = new Date(startTime).getTime();
    if (isNaN(startTimestamp)) {
      setElapsedTime('00:00:00');
      return;
    }

    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const difference = (now - startTimestamp) / 1000;
      setElapsedTime(formatTime(difference));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [startTime]);

  return elapsedTime;
};

export default useTimer;