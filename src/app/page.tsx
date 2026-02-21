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

// A simple fetcher function for SWR to use
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HomePage() {
  const isLoggedIn = useGameStore((s) => s.isLoggedIn);
  const { logout } = useGameStoreApi().getState();

  const handleSignOut = () => {
    logout();
  };

  // MODIFIED: The SWR key is now the API route
  const {
    data: leaderboardData,
    isLoading: isLeaderboardLoading,
    error: leaderboardError,
  } = useSWR('/api/leaderboard', fetcher, { // <-- CHANGE HERE
    refreshInterval: 2000,
  });

  useEffect(() => {
    if (leaderboardError) {
      toast.error('Failed to load leaderboard.');
    }
  }, [leaderboardError]);

  const leaderboard: LeaderboardEntry[] = leaderboardData?.entries || [];
  const characters: Character[] = []; // Characters are not fetched on the homepage anymore

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} onSignOut={handleSignOut} />
      <main className="mx-auto max-w-screen-2xl p-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {isLeaderboardLoading ? (
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
            {isLeaderboardLoading ? (
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
