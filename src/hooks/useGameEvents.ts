import { useEffect, useRef } from 'react';
import { useGameStoreApi } from '@/contexts/GameContext';
import { useSWRConfig } from 'swr';

const API_BASE_URL = '/api';

export const useGameEvents = () => {
  const storeApi = useGameStoreApi();
  const { mutate } = useSWRConfig();
  // Use a ref to hold the event source instance.
  // This prevents re-creating the connection on every render
  // and makes it resilient to Strict Mode's double-invocation of useEffect.
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Only create a new EventSource if one doesn't already exist.
    if (!eventSourceRef.current) {
      const { getState } = storeApi;
      const { sessionId } = getState();

      const eventSource = new EventSource(`${API_BASE_URL}/events`);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('[SSE] Connection opened.');
      };

      eventSource.addEventListener('BOARD_RESET', (_event) => {
        console.log('[SSE] Board reset detected, refetching all data...');
        // Invalidate all SWR caches so the UI re-fetches fresh data.
        mutate('/api/game/master-board');
        mutate('/api/team/progress');
        mutate('/api/game/leaderboard');
      });

      eventSource.addEventListener('game_update', (event) => {
        const payload = JSON.parse(event.data);
        console.log('[SSE] Game update received:', payload);
        // Invalidate relevant SWR caches to trigger a re-fetch.
        mutate('/api/game/master-board');
        mutate('/api/team/progress');
        mutate('/api/game/leaderboard');
      });

      eventSource.onerror = (err) => {
        console.error('EventSource failed:', err);
        eventSource.close();
        eventSourceRef.current = null; // Allow reconnection on next effect run
      };
    }

    // The cleanup function will run when the component unmounts.
    return () => {
      if (eventSourceRef.current) {
        console.log('[SSE] Closing connection.');
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
    // We only want this effect to run once on mount, so we provide an empty dependency array.
    // The functions from the store and swr are stable.
  }, [storeApi, mutate]);
};