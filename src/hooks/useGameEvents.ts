'use client';

import { useEffect, useRef, useCallback } from 'react';
import Cookies from 'js-cookie';
import { useSWRConfig } from 'swr';
import { StoreApi } from 'zustand';
import { GameStore } from '@/store/game-store';

export function useGameEvents(storeApi?: StoreApi<GameStore>) {
  const { mutate } = useSWRConfig();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isMountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!isMountedRef.current) return;

    // Clean up any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    const eventSource = new EventSource('/api/events');
    eventSourceRef.current = eventSource;

    eventSource.addEventListener('game_update', (event) => {
      reconnectAttemptsRef.current = 0; // Reset backoff on successful message

      // Global data is always stale after any game update.
      mutate('/api/game/master-board', undefined, { revalidate: true });
      mutate('/api/game/leaderboard', undefined, { revalidate: true });

      // Team-specific progress should only be refetched when the event belongs
      // to THIS team. Refetching for every event would cause Tab 1 to receive
      // Tab 2's data when both teams are connected to the same SSE stream.
      try {
        const payload = JSON.parse(event.data) as { teamId?: string };
        const currentTeamId = storeApi?.getState().team?.id ?? Cookies.get('teamId');
        if (!payload.teamId || !currentTeamId || payload.teamId === currentTeamId) {
          mutate('/api/team/progress');
        }
      } catch {
        // Unparseable payload — refetch to be safe.
        mutate('/api/team/progress');
      }
    });

    eventSource.onopen = () => {
      reconnectAttemptsRef.current = 0;
    };

    eventSource.onerror = () => {
      eventSource.close();
      eventSourceRef.current = null;

      if (!isMountedRef.current) return;

      // Exponential backoff: 1s, 2s, 4s, 8s, 16s, max 30s
      const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
      reconnectAttemptsRef.current += 1;

      reconnectTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          connect();
        }
      }, delay);
    };
  }, [mutate, storeApi]);

  useEffect(() => {
    isMountedRef.current = true;
    connect();

    return () => {
      isMountedRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [connect]);
}