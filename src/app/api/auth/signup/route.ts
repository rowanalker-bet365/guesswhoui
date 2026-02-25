import { fetchPublic } from '@/lib/server/service-client';
import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_GUESSWHOSERVICE_URL;

export async function POST(request: Request) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: 'Service URL not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const res = await fetchPublic(`${API_BASE_URL}/client/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: (errorData as { message?: string }).message || `Error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to signup:', error);
    return NextResponse.json(
      { message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}