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
import Cookies from 'js-cookie';
import { useGameStore, useGameStoreApi } from '@/contexts/GameContext';
import { useRouter } from 'next/navigation';
import useTimer from '@/hooks/useTimer';
import { MilestoneTrackerSkeleton } from '@/components/organisms/MilestoneTrackerSkeleton';
import { CHARACTER_IMAGES, DEFAULT_CHARACTER_IMAGE } from '@/lib/characters';

const TeamDashboard = () => {
  const team = useGameStore((s) => s.team);
  const { mutate } = useSWRConfig();
  const [isResetting, setIsResetting] = useState(false);

  const fetcher = (url: string) => {
    const teamId = Cookies.get('teamId');
    return fetch(url, {
      headers: {
        'X-Team-Id': teamId || '',
      },
    }).then((res) => res.json());
  };

  const {
    data: teamProgress,
    isLoading: isTeamProgressLoading,
    error,
  } = useSWR(team ? '/api/team/progress' : null, fetcher);

  const sessionId = useGameStore((s) => s.sessionId)

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
    if (!teamProgress) return [];
    
    return Object.entries(CHARACTER_IMAGES).map(([id, imagePath]) => {
      const isSolved = teamProgress.solvedCharacters.includes(id);
      return {
        id,
        name: `Character ${id}`,
        imagePath: isSolved ? imagePath : DEFAULT_CHARACTER_IMAGE,
        isSolved,
        solvedByTeams: []
      };
    });
  }, [teamProgress]);

  const runningTime = useTimer(challengeStartTime);
  const isLoading = isTeamProgressLoading;

  const handleReset = async () => {
    const toastId = toast.loading('Resetting board...');
    setIsResetting(true);
    try {
      await fetch('/api/team/reset', {
        method: 'POST',
        headers: {
          'X-Team-Id': Cookies.get('teamId') || '',
        },
      });
      await mutate('/api/team/progress');
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
          teamId={team?.id || 'N/A'}
          sessionId={sessionId || 'N/A'}
          totalSolves={totalSolves}
          fastestSolve={fastestSolve}
          challengeStartTime={challengeStartTime}
          runningTime={runningTime}
          totalScore={totalScore}
          onReset={handleReset}
          isResetting={isResetting}
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