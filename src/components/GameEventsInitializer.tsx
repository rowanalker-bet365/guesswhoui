'use client';

import { useGameEvents } from '@/hooks/useGameEvents';
import { Toaster } from 'react-hot-toast';

export default function GameEventsInitializer() {
  useGameEvents();
  return <Toaster position="bottom-right" />;
}