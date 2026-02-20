'use client';

import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Header } from '@/components/organisms/Header';
import { TeamMetricsBanner } from '@/components/organisms/TeamMetricsBanner';
import { MilestoneTracker } from '@/components/organisms/MilestoneTracker';
import { GameBoard } from '@/components/organisms/GameBoard';
import { Button } from '@/components/atoms/Button';
import { GameBoardSkeleton } from '@/components/organisms/GameBoardSkeleton';
import { Character, GameState } from '@/store/game-store';
import useSWR, { useSWRConfig } from 'swr';
import { api, fetcher } from '@/lib/api';
import { useGameStore, useGameStoreApi } from '@/contexts/GameContext';
import { useRouter } from 'next/navigation';
import useTimer from '@/hooks/useTimer';
import { MilestoneTrackerSkeleton } from '@/components/organisms/MilestoneTrackerSkeleton';

const TeamDashboard = () => {
  const team = useGameStore((s) => s.team);
  const { mutate } = useSWRConfig();
  const [isResetting, setIsResetting] = useState(false);

  const {
    data: teamProgress,
    isLoading: isTeamProgressLoading,
    error,
  } = useSWR(
    team ? ['team-progress', team.name] : null,
    () => api.getTeamProgress(),
  );

  const sessionId = useGameStore((s) => s.sessionId);

  const { data: boardData, isLoading: isGameLoading } = useSWR(
    sessionId ? ['board', sessionId] : null,
    () => api.getBoard(sessionId!),
  );

  useEffect(() => {
    if (error) {
      toast.error('Failed to load team progress.');
    }
  }, [error]);

  const {
    totalSolves,
    fastestSolve,
    challengeStartTime,
    totalScore,
    completedMilestones,
  } = useMemo(() => {
    return (
      teamProgress || {
        totalSolves: 0,
        fastestSolve: 0,
        challengeStartTime: '',
        totalScore: 0,
        completedMilestones: [],
      }
    );
  }, [teamProgress]);

  const characters = useMemo(() => {
    if (!boardData || !teamProgress) return [];
    return boardData.candidates.map((char: Character) => ({
      ...char,
      isSolved: teamProgress.solvedCharacters.includes(char.id),
    }));
  }, [boardData, teamProgress]);

  const runningTime = useTimer(challengeStartTime);
  const isLoading = isGameLoading || isTeamProgressLoading;

  const handleReset = async () => {
    const toastId = toast.loading('Resetting board...');
    setIsResetting(true);
    try {
      await api.resetBoard();
      await mutate('/team/progress');
      toast.success('Board reset successfully!', { id: toastId });
    } catch (error) {
      console.error('Failed to reset board:', error);
      toast.error('Failed to reset board.', { id: toastId });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <main className="mx-auto max-w-screen-2xl p-4">
      <div className="mb-8">
        <TeamMetricsBanner
          teamName={team?.name || 'N/A'}
          teamColor={team?.color || '#000000'}
          totalSolves={totalSolves}
          fastestSolve={fastestSolve}
          challengeStartTime={challengeStartTime}
          runningTime={runningTime}
          totalScore={totalScore}
        />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          {isLoading ? (
            <MilestoneTrackerSkeleton />
          ) : (
            <MilestoneTracker completedMilestones={completedMilestones} />
          )}
        </div>
        <div className="lg:col-span-2">
          {isLoading ? (
            <GameBoardSkeleton />
          ) : (
            <GameBoard characters={characters} displayMode="team" />
          )}
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleReset}
              variant="default"
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
  const isLoggedIn = useGameStore((s) => s.isLoggedIn);
  const team = useGameStore((s) => s.team);
  const { logout } = useGameStoreApi().getState();

  const handleSignOut = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} teamName={team?.name} onSignOut={handleSignOut} />
      <TeamDashboard />
    </div>
  );
}