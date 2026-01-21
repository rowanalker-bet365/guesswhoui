import { createStore } from 'zustand/vanilla';

// --- Type Definitions (Single Source of Truth) ---

export type Team = {
  id: string;
  name: string;
  color: string;
};

export type Character = {
  id: string;
  isSolved: boolean;
  imageUrl?: string;
  solvedByTeams?: { teamId: string; color: string }[];
};

export type LeaderboardEntry = {
  rank: number;
  teamName: string;
  score: number;
};

export type Stage = {
  name: string;
  status: 'completed' | 'in_progress' | 'not_started';
  timeTaken?: string;
};

// --- Store Shape ---

export type GameState = {
  // Auth State
  isLoggedIn: boolean;
  authToken?: string;
  team?: Team;
  // Game State
  characters: Character[];
  leaderboard: LeaderboardEntry[];
  teamProgress: {
    stages: Stage[];
    characters: Character[];
    metrics: {
      currentStage: string;
      startTime: string;
      efficiency: string;
    };
  };
};

export type GameActions = {
  login: (team: Team, token: string) => void;
  logout: () => void;
  setGameState: (characters: Character[], leaderboard: LeaderboardEntry[]) => void;
  setTeamProgress: (progress: GameState['teamProgress']) => void;
  updateCharacter: (characterUpdate: { characterId: string; teamId: string }) => void;
};

export type GameStore = GameState & GameActions;

// --- Store Implementation ---

export const defaultInitState: GameState = {
  isLoggedIn: false,
  authToken: undefined,
  team: undefined,
  characters: [],
  leaderboard: [],
  teamProgress: {
    stages: [],
    characters: [],
    metrics: {
      currentStage: 'N/A',
      startTime: 'N/A',
      efficiency: 'N/A',
    },
  },
};

export const createGameStore = (initState: GameState = defaultInitState) => {
  return createStore<GameStore>()((set) => ({
    ...initState,
    login: (team, token) => set({ isLoggedIn: true, team, authToken: token }),
    logout: () => set({ isLoggedIn: false, team: undefined, authToken: undefined }),
    setGameState: (characters, leaderboard) => set({ characters, leaderboard }),
    setTeamProgress: (teamProgress) => set({ teamProgress }),
    updateCharacter: ({ characterId, teamId }) =>
      set((state) => ({
        characters: state.characters.map((char) =>
          char.id === characterId
            ? {
                ...char,
                isSolved: true,
                solvedByTeams: [
                  ...(char.solvedByTeams || []),
                  { teamId, color: state.team?.color || '#000000' },
                ],
              }
            : char
        ),
      })),
  }));
};