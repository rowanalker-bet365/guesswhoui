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
  sessionId?: string;
  characters: Character[];
  leaderboard: LeaderboardEntry[];
  teamProgress: TeamData;
};

export type GameActions = {
  login: (team: Team, token: string) => void;
  logout: () => void;
  restoreSession: () => void;
  setSessionId: (sessionId: string) => void;
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
  sessionId: undefined,
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
      Cookies.set('teamId', team.id, { expires: 1 }); // Required for X-Team-Id header in API calls
      localStorage.setItem('guesswho_team', JSON.stringify(team));
      set({ isLoggedIn: true, team, authToken: token });
    },
    logout: () => {
      Cookies.remove('guesswho_authtoken');
      Cookies.remove('teamId');
      Cookies.remove('sessionId');
      localStorage.removeItem('guesswho_team');
      set({
        isLoggedIn: false,
        team: undefined,
        authToken: undefined,
        sessionId: undefined,
      });
    },
    restoreSession: () => {
      const storedTeam = localStorage.getItem('guesswho_team');
      const authToken = Cookies.get('guesswho_authtoken');
      if (storedTeam && authToken) {
        try {
          const team = JSON.parse(storedTeam);
          set({ isLoggedIn: true, team, authToken });
        } catch {
          // Corrupted data — clear it
          localStorage.removeItem('guesswho_team');
        }
      }
    },
    setSessionId: (sessionId) => set({ sessionId }),
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