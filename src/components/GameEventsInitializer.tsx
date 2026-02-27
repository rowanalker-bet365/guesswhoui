'use client';

import { useGameEvents } from '@/hooks/useGameEvents';
import { useGameStoreApi } from '@/contexts/GameContext';
import { Toaster } from 'react-hot-toast';

export default function GameEventsInitializer() {
  const storeApi = useGameStoreApi();
  useGameEvents(storeApi);
  return <Toaster position="bottom-right" />;
}