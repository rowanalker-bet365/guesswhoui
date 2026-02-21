import { fetchWithAuth } from '@/lib/server/service-client';
import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_GUESSWHOSERVICE_URL;

export async function GET() {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: 'Service URL not configured' },
      { status: 500 }
    );
  }

  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/v1/client/leaderboard`);

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(errorData, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json(
      { message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}