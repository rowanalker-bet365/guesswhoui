'use client';

import { useEffect, useRef, useCallback } from 'react';
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

    eventSource.addEventListener('game_update', () => {
      reconnectAttemptsRef.current = 0; // Reset backoff on successful message
      mutate('/api/game/master-board');
      mutate('/api/team/progress');
      mutate('/api/game/leaderboard');
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
  }, [mutate]);

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