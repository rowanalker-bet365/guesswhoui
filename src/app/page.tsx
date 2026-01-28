'use client';

import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { GameBoard } from '@/components/organisms/GameBoard';
import { GameBoardSkeleton } from '@/components/organisms/GameBoardSkeleton';
import { Leaderboard } from '@/components/organisms/Leaderboard';
import { LeaderboardSkeleton } from '@/components/organisms/LeaderboardSkeleton';
import { Header } from '@/components/organisms/Header';
import { useGameStore, useGameStoreApi } from '@/contexts/GameContext';
import { Character, LeaderboardEntry } from '@/store/game-store';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';

export default function HomePage() {
  const isLoggedIn = useGameStore((s) => s.isLoggedIn);
  const { logout } = useGameStoreApi().getState();

  const handleSignOut = () => {
    logout();
  };

  const {
    data,
    isLoading,
    error,
  } = useSWR<{ characters: Character[]; leaderboard: LeaderboardEntry[] }>(
    '/game/state',
    fetcher,
    { refreshInterval: 2000 }
  );

  useEffect(() => {
    if (error) {
      toast.error('Failed to load game state.');
    }
  }, [error]);

  const characters: Character[] = data?.characters || [];
  const leaderboard: LeaderboardEntry[] = data?.leaderboard || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} onSignOut={handleSignOut} />
      <main className="mx-auto max-w-screen-2xl p-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {isLoading ? (
              <GameBoardSkeleton />
            ) : (
              <GameBoard
                characters={characters}
                displayMode="home"
                totalTeams={leaderboard.length}
              />
            )}
          </div>
          <div>
            {isLoading ? (
              <LeaderboardSkeleton />
            ) : (
              <Leaderboard entries={leaderboard} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
