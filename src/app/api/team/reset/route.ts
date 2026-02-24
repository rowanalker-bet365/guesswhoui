import { fetchFromService } from '@/lib/server/service-client';
import { NextResponse } from 'next/server';
import { headers, cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_GUESSWHOSERVICE_URL;

export async function POST() {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: 'Service URL not configured' },
      { status: 500 }
    );
  }

  const headersList = headers();
  const teamId = headersList.get('X-Team-Id');
  const cookieStore = cookies();
  const authToken = cookieStore.get('guesswho_authtoken')?.value;

  try {
    const res = await fetchFromService(
      `${API_BASE_URL}/client/team/reset`,
      {
        method: 'POST',
        headers: {
          'X-Team-Id': teamId || '',
        },
      },
      authToken
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(errorData, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to reset board:', error);
    return NextResponse.json(
      { message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}