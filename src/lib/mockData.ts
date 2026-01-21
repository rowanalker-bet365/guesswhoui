/**
 * This file contains mock data for development and testing purposes.
 * In a production environment, this data would be fetched from the API.
 */

import { Character, LeaderboardEntry, Stage } from '@/store/game-store';

// --- Mock Data ---

export const mockCharacters: Character[] = Array.from({ length: 64 }, (_, i) => ({
  id: `c_${i + 1}`,
  isSolved: Math.random() > 0.8,
  imageUrl: `https://picsum.photos/seed/${i + 1}/200`,
  solvedByTeams: Math.random() > 0.9 ? [{ teamId: 'team1', color: '#ef4444' }] : [],
}));

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, teamName: 'Team Alpha', score: 15200 },
  { rank: 2, teamName: 'Team Bravo', score: 13800 },
  { rank: 3, teamName: 'Team Charlie', score: 12100 },
  { rank: 4, teamName: 'Team Delta', score: 11500 },
  { rank: 5, teamName: 'Team Echo', score: 9800 },
];

export const mockTeam = {
  name: 'Team Alpha',
  color: '#3b82f6',
};

export const mockMetrics = {
  currentStage: 'M5 - Resilience',
  startTime: '10:32 AM',
  efficiency: '12m 45s',
  runningTime: '00:25:18',
};

export const mockStages: Stage[] = [
  { name: 'M1 - First Round Started', status: 'completed', timeTaken: '0m 5s' },
  { name: 'M2 - First Successful Question', status: 'completed', timeTaken: '1m 22s' },
  { name: 'M3 - Elimination Working', status: 'completed', timeTaken: '3m 10s' },
  { name: 'M4 - Encrypted Answer Handled', status: 'completed', timeTaken: '8m 8s' },
  { name: 'M5 - Resilience', status: 'in_progress' },
  { name: 'M6 - First Correct Solve', status: 'not_started' },
  { name: 'S1 - Efficiency', status: 'not_started' },
];

export const mockTeamCharacters: Character[] = Array.from({ length: 64 }, (_, i) => ({
  id: `c_${i + 1}`,
  isSolved: Math.random() > 0.5,
  imageUrl: `https://picsum.photos/seed/${i + 1}/200`,
}));