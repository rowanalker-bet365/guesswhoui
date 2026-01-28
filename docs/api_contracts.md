# API Contracts and Data Models

This document defines the data contracts for the application's API and the core data models.

## Core Data Models

### TeamData

This is the central model for a team's private state.

```typescript
interface TeamData {
  id: string;
  teamName: string;
  teamColor: string;
  challengeStartTime: string; // ISO 8601 timestamp
  totalSolves: number;
  solvedCharacters: string[]; // Array of character IDs
  fastestSolve: number; // Duration in milliseconds
  totalScore: number;
}
```

### Public Game State Models

These models are for data that is visible to all teams.

```typescript
// Represents a character on the game board
interface ApiCharacter {
  id: string;
  imageUrl: string;
  solvedByTeams: { teamId: string; color: string }[];
}

// Represents a single entry on the leaderboard
interface ApiLeaderboardEntry {
  rank: number;
  teamName: string;
  score: number;
  solves: number;
  quickestSolve: number; // duration in ms
  teamColor: string;
}
```

## API Endpoint Contracts

### Authentication

#### `POST /api/auth/signup`

- **Description:** Creates a new team.
- **Request:** `SignupRequest`
  ```typescript
  interface SignupRequest {
    teamName: string;
    password: string;
  }
  ```
- **Response:** `SignupResponse`
  ```typescript
  interface SignupResponse {
    message: string;
  }
  ```

#### `POST /api/auth/login`

- **Description:** Authenticates a team and returns a JWT.
- **Request:** `LoginRequest`
  ```typescript
  interface LoginRequest {
    teamName: string;
    password: string;
  }
  ```
- **Response:** `LoginResponse`
  ```typescript
  interface LoginResponse {
    token: string;
    team: {
      id: string;
      name: string;
      color: string;
    };
  }
  ```

### Game State & Progress

#### `GET /api/game/state`

- **Description:** Returns the public game state, including all characters and the current leaderboard. Requires authentication.
- **Response:** `GetGameStateResponse`
  ```typescript
  interface GetGameStateResponse {
    characters: ApiCharacter[];
    leaderboard: ApiLeaderboardEntry[];
  }
  ```

#### `GET /api/team/progress`

- **Description:** Returns the private progress for the authenticated team. Requires authentication.
- **Response:** `GetTeamProgressResponse`
  ```typescript
  type GetTeamProgressResponse = TeamData;
  ```

### Team Actions

#### `POST /api/team/reset`

- **Description:** Resets the `solvedCharacters` array for the authenticated team. Requires authentication.
- **Response:** `ResetResponse`
  ```typescript
  interface ResetResponse {
    message: string;
  }
  ```

## Example Team Data

This is an example of a `TeamData` object.

```json
{
  "id": "team-alpha-123",
  "teamName": "Team Alpha",
  "teamColor": "#FF5733",
  "challengeStartTime": "2024-01-01T12:00:00.000Z",
  "totalSolves": 5,
  "solvedCharacters": ["char-001", "char-007", "char-012", "char-023", "char-034"],
  "fastestSolve": 12500,
  "totalScore": 1250
}