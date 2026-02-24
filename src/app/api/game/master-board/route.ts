import { fetchPublic } from '@/lib/server/service-client';
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
    // The backend mounts the master board handler at /game/master-board
    const res = await fetchPublic(`${API_BASE_URL}/client/game/master-board`);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || `Error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch master board:', error);
    return NextResponse.json(
      { message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}