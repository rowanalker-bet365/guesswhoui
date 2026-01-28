import { generateCharacters, generateLeaderboard, generateTeamProgress } from '@/lib/mockData';

// This file mimics the logic of the mock server, but runs within the Next.js process.

export function handleApiRequest(
  slug: string,
  method: string,
  body: any,
  search: string
) {
  console.log(`[Mock API] ${method} /api/${slug}${search}`);

  if (slug === 'auth/login' && method === 'POST') {
    const { teamName } = body;
    return {
      status: 200,
      body: {
        token: 'mock-token',
        team: { id: 'team1', name: teamName, color: '#3b82f6' },
      },
    };
  }

  if (slug === 'auth/signup' && method === 'POST') {
    return { status: 201, body: { message: 'Team created successfully' } };
  }

  if (slug === 'game/state' && method === 'GET') {
    return {
      status: 200,
      body: {
        characters: generateCharacters(64),
        leaderboard: generateLeaderboard(),
      },
    };
  }

  if (slug === 'team/progress' && method === 'GET') {
    const params = new URLSearchParams(search);
    const teamName = params.get('teamName');
    return {
      status: 200,
      body: generateTeamProgress(teamName || 'Unknown Team'),
    };
  }

  if (slug === 'team/reset' && method === 'POST') {
    // In a real scenario, this would trigger a re-fetch via SSE.
    // For this mock, the client-side mutate() will handle the re-fetch.
    return { status: 200, body: { message: 'Board reset successfully' } };
  }

  return { status: 404, body: { message: 'Not Found' } };
}