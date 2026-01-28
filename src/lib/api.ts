import {
  GetGameStateResponse,
  GetTeamProgressResponse,
  LoginRequest,
  LoginResponse,
  ResetResponse,
  SignupRequest,
  SignupResponse,
} from '@/types';
import Cookies from 'js-cookie';

const API_BASE_URL = '/api';

export class ApiError extends Error {
  info: any;
  status: number;

  constructor(message: string, status: number, info: any) {
    super(message);
    this.status = status;
    this.info = info;
  }
}

// --- Generic Fetcher ---

export async function fetcher<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const authToken = Cookies.get('guesswho_authtoken');
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorInfo;
    try {
      errorInfo = await res.json();
    } catch (e) {
      errorInfo = { message: res.statusText };
    }
    throw new ApiError(
      'An error occurred while fetching the data.',
      res.status,
      errorInfo
    );
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

  async signup(data: SignupRequest): Promise<SignupResponse> {
    return fetcher('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
      signal: this.getAbortSignal('signup'),
    });
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    return fetcher('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      signal: this.getAbortSignal('login'),
    });
  }

  async getGameState(): Promise<GetGameStateResponse> {
    return fetcher('/game/state', {
      signal: this.getAbortSignal('getGameState'),
    });
  }

  async getTeamProgress(): Promise<GetTeamProgressResponse> {
    return fetcher('/team/progress', {
      signal: this.getAbortSignal('getTeamProgress'),
    });
  }

  async resetBoard(): Promise<ResetResponse> {
    return fetcher('/team/reset', {
      method: 'POST',
      signal: this.getAbortSignal('resetBoard'),
    });
  }
}

export const api = new ApiClient();