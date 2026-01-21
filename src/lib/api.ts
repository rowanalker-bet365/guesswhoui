import { Character, GameState, LeaderboardEntry, Team } from '@/store/game-store';

const API_BASE_URL = 'http://localhost:3001/api';

// --- Generic Fetcher ---

async function fetcher<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    // @ts-ignore
    error.info = await res.json();
    // @ts-ignore
    error.status = res.status;
    throw error;
  }

  return res.json();
}

// --- API Client Class ---

class ApiClient {
  private abortControllers: Map<string, AbortController> = new Map();

  private getAbortSignal(key: string): AbortSignal {
    this.abortControllers.get(key)?.abort();
    const newController = new AbortController();
    this.abortControllers.set(key, newController);
    return newController.signal;
  }

  async signup(teamName: string, password: string): Promise<{ message: string }> {
    return fetcher('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ teamName, password }),
      signal: this.getAbortSignal('signup'),
    });
  }

  async login(teamName: string, password: string): Promise<{ token: string; team: Team }> {
    return fetcher('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ teamName, password }),
      signal: this.getAbortSignal('login'),
    });
  }

  async getGameState(): Promise<{ characters: Character[]; leaderboard: LeaderboardEntry[] }> {
    return fetcher('/game/state', {
      signal: this.getAbortSignal('getGameState'),
    });
  }

  async getTeamProgress(): Promise<GameState['teamProgress']> {
    return fetcher('/team/progress', {
      signal: this.getAbortSignal('getTeamProgress'),
    });
  }

  async resetBoard(): Promise<{ message: string }> {
    return fetcher('/team/reset', {
      method: 'POST',
      signal: this.getAbortSignal('resetBoard'),
    });
  }
}

export const api = new ApiClient();