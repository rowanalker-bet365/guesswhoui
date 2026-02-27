import { fetchPublic } from '@/lib/server/service-client';
import { NextResponse } from 'next/server';
import { ApiLeaderboardEntry } from '@/types';

export const dynamic = 'force-dynamic';

const API_BASE_URL = process.env.NEXT_PUBLIC_GUESSWHOSERVICE_URL;

/**
 * Shape returned by the Go backend's GetLeaderboardEntries.
 * Already sorted highest-score first by ZREVRANGE.
 */
interface BackendLeaderboardEntry {
  teamId: string;
  score: number;
  name: string;
  color: string;
  solves: number;
  fastestSolveMs: number; // milliseconds, 0 if no solve yet
}

export async function GET() {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: 'Service URL not configured' },
      { status: 500 }
    );
  }

  try {
    const res = await fetchPublic(`${API_BASE_URL}/client/game/leaderboard`);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: (errorData as { message?: string }).message || `Error: ${res.status}` },
        { status: res.status }
      );
    }

    const data: { entries: BackendLeaderboardEntry[] } = await res.json();

    // Transform backend shape → ApiLeaderboardEntry (what the UI components expect).
    // The backend already returns entries in descending score order (ZREVRANGE),
    // so rank is simply the 1-based index.
    const entries: ApiLeaderboardEntry[] = (data.entries ?? []).map(
      (entry, index) => ({
        rank: index + 1,
        teamName: entry.name,
        score: entry.score,
        solves: entry.solves,
        quickestSolve: entry.fastestSolveMs, // already in ms
        teamColor: entry.color,
      })
    );

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json(
      { message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}