import { useEffect } from 'react';
import { useGameStoreApi } from '@/contexts/GameContext';

const API_BASE_URL = 'http://localhost:3001/api';

export const useGameEvents = () => {
  const { setGameState, setTeamProgress, updateCharacter } = useGameStoreApi().getState();

  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE_URL}/events`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('[SSE] Received event:', data);

      switch (data.type) {
        case 'WELCOME':
          // Optionally handle the welcome message
          break;
        case 'GAME_UPDATE':
          // This is a generic update, we could refetch or update a specific character
          updateCharacter(data.payload);
          break;
        case 'BOARD_RESET':
          // The board was reset, refetch everything
          // In a real app, you'd call the functions that fetch data
          console.log('[SSE] Board reset detected, refetching data...');
          break;
        // Add more specific event types as needed
      }
    };

    eventSource.onerror = (err) => {
      console.error('EventSource failed:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [setGameState, setTeamProgress, updateCharacter]);
};