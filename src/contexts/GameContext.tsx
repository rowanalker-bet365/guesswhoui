'use client';

import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { createGameStore, type GameStore } from '@/store/game-store';

type GameStoreApi = ReturnType<typeof createGameStore>;

const GameStoreContext = createContext<GameStoreApi | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<GameStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createGameStore();
  }

  return (
    <GameStoreContext.Provider value={storeRef.current}>
      {children}
    </GameStoreContext.Provider>
  );
};

export const useGameStore = <T,>(selector: (store: GameStore) => T): T => {
  const gameStoreContext = useContext(GameStoreContext);

  if (!gameStoreContext) {
    throw new Error(`useGameStore must be used within a GameProvider`);
  }

  return useStore(gameStoreContext, selector);
};

export const useGameStoreApi = () => {
  const gameStoreContext = useContext(GameStoreContext);

  if (!gameStoreContext) {
    throw new Error('useGameStoreApi must be used within a GameProvider');
  }

  return gameStoreContext;
};