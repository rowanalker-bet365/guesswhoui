'use client';

import React, { useState } from 'react';
import { Header } from '@/components/organisms/Header';
import { TeamMetricsBanner } from '@/components/organisms/TeamMetricsBanner';
import { StageTracker } from '@/components/organisms/StageTracker';
import { GameBoard } from '@/components/organisms/GameBoard';
import { Button } from '@/components/atoms/Button';
import { StageTrackerSkeleton } from '@/components/organisms/StageTrackerSkeleton';
import { GameBoardSkeleton } from '@/components/organisms/GameBoardSkeleton';
import { Character, Stage } from '@/store/game-store';
import useSWR, { useSWRConfig } from 'swr';
import { api } from '@/lib/api';
import { useGameStore, useGameStoreApi } from '@/contexts/GameContext';
import { useRouter } from 'next/navigation';
import useTimer from '@/hooks/useTimer';

const TeamDashboard = () => {
  const { team } = useGameStore((s) => ({ team: s.team }));
  const { mutate } = useSWRConfig();
  const [isResetting, setIsResetting] = useState(false);

  const {
    data: teamProgress,
    isLoading,
  } = useSWR('/api/team/progress', api.getTeamProgress);

  const stages: Stage[] = teamProgress?.stages || [];
  const characters: Character[] = teamProgress?.characters || [];
  const metrics = teamProgress?.metrics || {
    currentStage: 'N/A',
    startTime: 'N/A',
    efficiency: 'N/A',
  };

  const runningTime = useTimer(metrics.startTime);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await api.resetBoard();
      await mutate('/api/team/progress');
    } catch (error) {
      console.error('Failed to reset board:', error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <div className="mb-8">
        <TeamMetricsBanner
          teamName={team?.name || 'N/A'}
          teamColor={team?.color || '#000000'}
          currentStage={metrics.currentStage}
          challengeStartTime={metrics.startTime}
          overallEfficiency={metrics.efficiency}
          runningTime={runningTime}
        />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          {isLoading ? <StageTrackerSkeleton /> : <StageTracker stages={stages} />}
        </div>
        <div className="lg:col-span-2">
          {isLoading ? <GameBoardSkeleton /> : <GameBoard characters={characters} />}
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleReset}
              variant="destructive"
              disabled={isResetting || isLoading}
            >
              {isResetting ? 'Resetting...' : 'Reset Board'}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default function TeamPage() {
  const router = useRouter();
  const { isLoggedIn, team } = useGameStore((s) => ({
    isLoggedIn: s.isLoggedIn,
    team: s.team,
  }));
  const { logout } = useGameStoreApi().getState();

  React.useEffect(() => {
    if (!isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoggedIn, router]);

  const handleSignOut = () => {
    logout();
    router.push('/');
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} teamName={team?.name} onSignOut={handleSignOut} />
      <TeamDashboard />
    </div>
  );
}