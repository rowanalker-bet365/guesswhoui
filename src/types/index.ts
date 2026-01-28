// --- Core Data Models ---

/**
 * This is the central model for a team's private state.
 */
export interface TeamData {
  id: string;
  teamName: string;
  teamColor: string;
  challengeStartTime: string; // ISO 8601 timestamp
  totalSolves: number;
  solvedCharacters: string[]; // Array of character IDs
  fastestSolve: number; // Duration in milliseconds
  totalScore: number;
  completedMilestones: { id: string; timeTaken: string }[];
}

/**
 * Represents a character on the game board.
 */
export interface ApiCharacter {
  id: string;
  imageUrl: string;
  solvedByTeams: { teamId: string; color: string }[];
}

/**
 * Represents a single entry on the leaderboard.
 */
export interface ApiLeaderboardEntry {
  rank: number;
  teamName: string;
  score: number;
  solves: number;
  quickestSolve: number; // duration in ms
  teamColor: string;
}

// --- API Endpoint Contracts ---

// POST /api/auth/signup
export interface SignupRequest {
  teamName: string;
  password: string;
}

export interface SignupResponse {
  message: string;
}

// POST /api/auth/login
export interface LoginRequest {
  teamName: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  team: {
    id: string;
    name: string;
    color: string;
  };
}

// GET /api/game/state
export interface GetGameStateResponse {
  characters: ApiCharacter[];
  leaderboard: ApiLeaderboardEntry[];
}

// GET /api/team/progress
export type GetTeamProgressResponse = TeamData;

// POST /api/team/reset
export interface ResetResponse {
  message: string;
}