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
import { fetchWithAuth, fetchPublic } from './api-client';

const API_BASE_URL =
	process.env.NEXT_PUBLIC_GUESSWHOSERVICE_URL || 'http://localhost:8080';

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
	options: RequestInit = {},
	isPublic: boolean = false
): Promise<T> {
	const teamId = Cookies.get('teamId');
	const headers = new Headers(options.headers);
	headers.set('Content-Type', 'application/json');

	// Add teamId to header for authenticated requests
	if (teamId) {
		headers.set('X-Team-Id', teamId);
	}

	const fetchFn = isPublic ? fetchPublic : fetchWithAuth;

	const res = await fetchFn(`${API_BASE_URL}/v1${url}`, {
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
  }, true);
 }

 async login(data: LoginRequest): Promise<LoginResponse> {
  return fetcher('/auth/login', {
   method: 'POST',
   body: JSON.stringify(data),
   signal: this.getAbortSignal('login'),
  }, true);
 }

 async getLeaderboard(): Promise<any> {
   return fetcher(
     '/client/leaderboard',
     {
       signal: this.getAbortSignal('getLeaderboard'),
     },
     false, // Authenticated
   );
  }

  async getBoard(sessionId: string): Promise<any> {
   return fetcher(
     `/client/sessions/${sessionId}/board`,
     {
       signal: this.getAbortSignal('getBoard'),
     },
     false, // Authenticated
   );
  }

 async getTeamProgress(): Promise<GetTeamProgressResponse> {
  return fetcher(
   '/client/team/progress',
   {
    signal: this.getAbortSignal('getTeamProgress'),
   },
   false // This is an authenticated endpoint
  );
 }

 async resetBoard(): Promise<ResetResponse> {
  return fetcher(
   '/team/reset',
   {
    method: 'POST',
    signal: this.getAbortSignal('resetBoard'),
   },
   false // This is an authenticated endpoint
  );
 }
}

export const api = new ApiClient();