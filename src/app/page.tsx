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
import { useMasterBoard } from '@/hooks/useMasterBoard';
import { CHARACTER_IMAGES } from '@/lib/characters';

// A simple fetcher function for SWR to use
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HomePage() {
  const isLoggedIn = useGameStore((s) => s.isLoggedIn);
  const { logout } = useGameStoreApi().getState();

  const handleSignOut = () => {
    logout();
  };

  const {
    data: leaderboardData,
    isLoading: isLeaderboardLoading,
    error: leaderboardError,
  } = useSWR('/api/game/leaderboard', fetcher);

  const {
    characters: masterBoardCharacters,
    isLoading: isBoardLoading,
    isError: boardError,
  } = useMasterBoard();

  useEffect(() => {
    if (leaderboardError) {
      toast.error('Failed to load leaderboard.');
    }
    if (boardError) {
      toast.error('Failed to load game board.');
    }
  }, [leaderboardError, boardError]);

  const leaderboard: LeaderboardEntry[] = leaderboardData?.entries || [];
  
  // Map ApiCharacter to Character (adding isSolved: false as it's not relevant for master board in the same way,
  // or we can derive it if needed, but for master board we mostly care about solvedByTeams)
  const characters: Character[] = masterBoardCharacters.map(c => {
    const isFullySolved = leaderboard.length > 0 && c.solvedByTeams && c.solvedByTeams.length === leaderboard.length;
    return {
      ...c,
      imagePath: isFullySolved ? (CHARACTER_IMAGES[c.id] || c.imagePath) : undefined,
      isSolved: false // Master board doesn't show "my" solved status, but global stats
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} onSignOut={handleSignOut} />
      <main className="mx-auto max-w-[1920px] p-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {isBoardLoading ? (
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
