import { Character, LeaderboardEntry } from '@/store/game-store';

// This file is now configured to generate fresh mock data on each API call
// during development. This simulates a live environment and allows for testing
// of dynamic data handling in components.

const TEAMS = [
  { id: 'team1', name: 'Team Alpha', color: '#ef4444' },
  { id: 'team2', name: 'Team Bravo', color: '#3b82f6' },
  { id: 'team3', name: 'Team Charlie', color: '#10b981' },
  { id: 'team4', name: 'Team Delta', color: '#f97316' },
  { id: 'team5', name: 'Team Echo', color: '#8b5cf6' },
];

let characterState: Character[] = [];

const initializeCharacters = (count: number): Character[] => {
  characterState = Array.from({ length: count }, (_, i) => ({
    id: `c_${i + 1}`,
    isSolved: false,
    imageUrl: `https://picsum.photos/seed/${i + 1}/200`,
    solvedByTeams: [],
  }));
  // Pre-populate some solves
  const mapToSolvedBy = (teams: typeof TEAMS) => teams.map(t => ({ teamId: t.id, color: t.color }));

  characterState[0].solvedByTeams = mapToSolvedBy([TEAMS[0], TEAMS[1], TEAMS[2], TEAMS[3], TEAMS[4]]); // Fully solved
  characterState[1].solvedByTeams = mapToSolvedBy([TEAMS[0], TEAMS[1]]); // Multi-solved
  characterState[2].solvedByTeams = mapToSolvedBy([TEAMS[2]]); // Single solved
  characterState[5].solvedByTeams = mapToSolvedBy([TEAMS[3], TEAMS[0]]); // Multi-solved
  characterState[10].solvedByTeams = mapToSolvedBy([TEAMS[4]]); // Single solved
  return characterState;
};

const solveRandomCharacter = () => {
  const unsolvedChars = characterState.filter(
    (c) => c.solvedByTeams && c.solvedByTeams.length < TEAMS.length
  );
  if (unsolvedChars.length === 0) return;

  const charToSolve = unsolvedChars[Math.floor(Math.random() * unsolvedChars.length)];
  const teamToSolve = TEAMS[Math.floor(Math.random() * TEAMS.length)];

  if (!charToSolve.solvedByTeams?.some((t) => t.teamId === teamToSolve.id)) {
    charToSolve.solvedByTeams?.push({ teamId: teamToSolve.id, color: teamToSolve.color });
    charToSolve.isSolved = true; // Mark as solved for team view
  }
};

const generateCharacters = (count: number): Character[] => {
  initializeCharacters(count);
  solveRandomCharacter();
  return characterState;
};

const generateLeaderboard = (): LeaderboardEntry[] => {
  return TEAMS.map((team, i) => {
    const solves = characterState.filter((c) =>
      c.solvedByTeams?.some((t) => t.teamId === team.id)
    ).length;
    return {
      rank: i + 1,
      teamName: team.name,
      score: solves * 1000 + Math.floor(Math.random() * 500),
      solves,
      quickestSolve: (Math.floor(Math.random() * 30) + 30) * 1000,
      teamColor: team.color,
    };
  }).sort((a, b) => b.score - a.score)
  .map((team, i) => ({ ...team, rank: i + 1 }));
};

const generateTeamProgress = (teamName: string) => {
  const team = TEAMS.find(t => t.name === teamName) || TEAMS[0];
  const solvedCharacters = characterState.filter((c) =>
    c.solvedByTeams?.some((t) => t.teamId === team.id)
  );

  return {
    id: team.id,
    teamName: team.name,
    teamColor: team.color,
    challengeStartTime: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    totalSolves: solvedCharacters.length,
    solvedCharacters: solvedCharacters.map(c => c.id),
    fastestSolve: 42000,
    totalScore: solvedCharacters.length * 1000 + Math.floor(Math.random() * 500),
    completedMilestones: [
      { id: 'first_round_started', timeTaken: '0m 1s' },
      { id: 'first_successful_question', timeTaken: '0m 5s' },
      { id: 'elimination_working', timeTaken: '0m 12s' },
      { id: 'first_correct_solve', timeTaken: '0m 25s' },
    ],
  };
};

// Export functions to be called by the mock API handler
export { generateCharacters, generateLeaderboard, generateTeamProgress };
