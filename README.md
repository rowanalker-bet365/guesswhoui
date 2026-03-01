# guesswhoui

The Next.js frontend for **Guess Who: Identity Under Fire** — a competitive team-based API challenge.

## Overview

`guesswhoui` serves two roles:

1. **Player UI** — displays the master board, team dashboard, leaderboard, and milestone tracker with real-time updates via Server-Sent Events
2. **Backend-for-Frontend (BFF)** — Next.js API routes proxy requests to `guesswhoservice`, adding authentication headers from server-side cookies. The SSE route connects directly to Redis pub/sub.

## Quick Start

### Prerequisites

- Node.js 18+
- A running `guesswhoservice` instance
- A running Redis instance (for SSE pub/sub)

### Run Locally

```bash
cd guesswhoui
npm install

# Set required environment variables
export NEXT_PUBLIC_GUESSWHOSERVICE_URL=http://localhost:8080
export REDIS_URL=redis://localhost:6379

npm run dev
```

The app starts on `http://localhost:3000`.

### Run with Docker

```bash
docker build -t guesswhoui .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_GUESSWHOSERVICE_URL=http://guesswhoservice:8080 \
  -e REDIS_URL=redis://redis:6379 \
  guesswhoui
```

## Configuration

| Environment Variable | Description | Required |
|---------------------|-------------|----------|
| `NEXT_PUBLIC_GUESSWHOSERVICE_URL` | Base URL of the Go backend service | Yes |
| `REDIS_URL` | Redis connection URL (used by SSE route for pub/sub) | Yes |

## Pages

| Route | Auth | Description |
|-------|------|-------------|
| `/` | Public | Master board (all 64 characters + global solve status) and leaderboard |
| `/auth/login` | Public | Team login form (redirects to `/team` if already authenticated) |
| `/auth/signup` | Public | Team registration form |
| `/team` | Required | Team dashboard: metrics banner, milestone tracker, team-specific board |

Authentication is enforced by `src/middleware.ts`. The `/team` route redirects to `/auth/login?redirected=true` if the `guesswho_authtoken` cookie is absent.

## BFF API Routes

These Next.js API routes are what the browser calls. They proxy to `guesswhoservice` and handle auth token forwarding.

| Method | Path | Proxies To | Auth |
|--------|------|-----------|------|
| `POST` | `/api/auth/login` | `/client/login` | None |
| `POST` | `/api/auth/signup` | `/client/signup` | None |
| `GET` | `/api/game/leaderboard` | `/client/game/leaderboard` | None |
| `GET` | `/api/game/master-board` | `/client/game/master-board` | None |
| `GET` | `/api/team/progress` | `/client/team/progress` | Cookie → Bearer token |
| `POST` | `/api/team/reset` | `/client/team/reset` | Cookie → Bearer token |
| `GET` | `/api/events` | Redis pub/sub directly | Cookie presence check |

> **Note:** The `/api/events` SSE route connects directly to Redis (not via `guesswhoservice`) and streams `game_update` events to the browser.

## Authentication Flow

1. Team submits login form → `POST /api/auth/login` → `guesswhoservice /client/login`
2. On success, the Zustand store calls `login(team, token)` which:
   - Sets `guesswho_authtoken` cookie (1 day)
   - Sets `teamId` cookie (1 day)
   - Saves team info to `localStorage` (`guesswho_team`)
3. On page load, `GameContext` calls `restoreSession()` to rehydrate state from cookies/localStorage
4. Protected BFF routes read `guesswho_authtoken` from the server-side cookie and forward it as `Authorization: Bearer <token>` to `guesswhoservice`

## Real-Time Updates

The app uses Server-Sent Events (SSE) for real-time board and leaderboard updates:

```
Redis pub/sub (game_updates channel)
  ↓
GET /api/events (SSE — Next.js route subscribes to Redis directly)
  ↓
useGameEvents hook (EventSource in browser)
  ↓ on game_update event:
  → mutate('/api/game/master-board')   — refreshes all characters' solve status
  → mutate('/api/game/leaderboard')    — refreshes scores/rankings
  → mutate('/api/team/progress')       — only if event.teamId matches current team
```

The `useGameEvents` hook implements exponential backoff reconnection on SSE errors. On reconnect, all SWR keys are revalidated to catch any missed events.

## State Management

State is managed with **Zustand** via `GameContext`:

| State Field | Type | Description |
|-------------|------|-------------|
| `isLoggedIn` | `boolean` | Whether the team is authenticated |
| `authToken` | `string \| undefined` | JWT token |
| `team` | `Team \| undefined` | Team info (id, name, color) |
| `sessionId` | `string \| undefined` | Current active session ID |
| `characters` | `Character[]` | Master board characters |
| `leaderboard` | `LeaderboardEntry[]` | Current leaderboard |
| `teamProgress` | `TeamData` | Team-specific progress data |

## Project Structure

```
guesswhoui/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home page (master board + leaderboard)
│   │   ├── layout.tsx                  # Root layout (GameProvider + SSE initialiser)
│   │   ├── auth/
│   │   │   ├── login/page.tsx          # Login page
│   │   │   └── signup/page.tsx         # Signup page
│   │   ├── team/page.tsx               # Team dashboard
│   │   └── api/                        # BFF API routes
│   │       ├── auth/login/route.ts
│   │       ├── auth/signup/route.ts
│   │       ├── events/route.ts         # SSE → Redis pub/sub
│   │       ├── game/leaderboard/route.ts
│   │       ├── game/master-board/route.ts
│   │       ├── team/progress/route.ts
│   │       └── team/reset/route.ts
│   ├── components/
│   │   ├── atoms/                      # Button, Input, Icon, Loader, etc.
│   │   ├── molecules/                  # CharacterTile, LeaderboardRow, MilestoneProgressItem
│   │   └── organisms/                  # GameBoard, Leaderboard, MilestoneTracker, Header, etc.
│   ├── contexts/
│   │   └── GameContext.tsx             # Zustand store provider + session restore
│   ├── hooks/
│   │   ├── useGameEvents.ts            # SSE connection + reconnect logic
│   │   ├── useMasterBoard.ts           # SWR hook for master board data
│   │   └── useTimer.ts                 # Session timer
│   ├── lib/
│   │   └── server/
│   │       └── service-client.ts       # Authenticated/unauthenticated fetch helpers
│   ├── middleware.ts                   # Route protection (cookie check)
│   ├── store/
│   │   └── game-store.ts              # Zustand store definition
│   └── types/
│       └── index.ts                   # Shared TypeScript types
├── next.config.mjs                    # Next.js config (standalone output)
├── tailwind.config.ts                 # Tailwind CSS config
└── Dockerfile                         # Multi-stage Next.js standalone build
```

## Testing

```bash
npm test
```

Tests use **Jest** with **React Testing Library**. Key test files:

- `src/components/molecules/__tests__/CharacterTile.test.tsx`
- `src/components/molecules/__tests__/LeaderboardRow.test.tsx`
- `src/components/molecules/__tests__/MilestoneProgressItem.test.tsx`
- `src/components/organisms/__tests__/GameBoard.test.tsx`
- `src/components/organisms/__tests__/Leaderboard.test.tsx`
- `src/components/organisms/__tests__/MilestoneTracker.test.tsx`
- `src/components/organisms/__tests__/TeamMetricsBanner.test.tsx`
- `src/components/organisms/__tests__/HowToPlayModal.test.tsx`

## Related Documentation

- [`guesswhoservice/README.md`](../guesswhoservice/README.md) — Go backend service
- [`guesswhoservice/docs/architecture.md`](../guesswhoservice/docs/architecture.md) — Full system architecture
- [`guesswhoservice/docs/api-reference.md`](../guesswhoservice/docs/api-reference.md) — API reference
- [`guesswhoservice/docs/game_instructions.md`](../guesswhoservice/docs/game_instructions.md) — Game instructions
- [`guesswhoservice/docs/infrastructure.md`](../guesswhoservice/docs/infrastructure.md) — GCP infrastructure
