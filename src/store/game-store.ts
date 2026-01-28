import { createStore } from 'zustand/vanilla';
import Cookies from 'js-cookie';
import {
  ApiCharacter,
  ApiLeaderboardEntry,
  GetTeamProgressResponse,
  LoginResponse,
  TeamData,
} from '@/types';

// --- Type Definitions (Single Source of Truth) ---

export type Team = LoginResponse['team'];
export type Character = ApiCharacter & { isSolved: boolean };
export type LeaderboardEntry = ApiLeaderboardEntry;

export type CompletedMilestone = {
  id: string;
  timeTaken: string;
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
  teamProgress: TeamData;
};

export type GameActions = {
  login: (team: Team, token: string) => void;
  logout: () => void;
  setGameState: (characters: Character[], leaderboard: LeaderboardEntry[]) => void;
  setTeamProgress: (progress: GetTeamProgressResponse) => void;
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
    id: '',
    teamName: '',
    teamColor: '',
    challengeStartTime: '',
    totalSolves: 0,
    solvedCharacters: [],
    fastestSolve: 0,
    totalScore: 0,
    completedMilestones: [],
  },
};

export const createGameStore = (initState: GameState = defaultInitState) => {
  return createStore<GameStore>()((set) => ({
    ...initState,
    login: (team, token) => {
      Cookies.set('guesswho_authtoken', token, { expires: 1 }); // Expires in 1 day
      set({ isLoggedIn: true, team, authToken: token });
    },
    logout: () => {
      Cookies.remove('guesswho_authtoken');
      set({ isLoggedIn: false, team: undefined, authToken: undefined });
    },
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