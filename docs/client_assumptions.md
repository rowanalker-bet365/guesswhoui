# Game Service API Assumptions

This document outlines the assumptions that the `guesswhoclientapi` (the client-facing, read-only service) makes about the `game-api` (the write-only game logic service).

The core assumption is that the `game-api` is the **single source of truth for all game state modifications**. The `guesswhoclientapi` is a stateless read-through cache that serves data stored and calculated by the `game-api` in a shared **Redis** instance.

## 1. Redis as the Data Store

The `guesswhoclientapi` assumes the `game-api` will manage and populate the following data structures in Redis.

### Team Data

-   **Key:** `team:<team-id>`
-   **Type:** `HASH`
-   **Description:** The `game-api` is responsible for creating and updating a hash for each team. The `guesswhoclientapi` reads this hash to serve the `/api/team/progress` endpoint.
-   **Expected Fields:**
    -   `id`: string
    -   `teamName`: string
    -   `teamColor`: string
    -   `totalScore`: integer
    -   `totalSolves`: integer
    -   `fastestSolve`: integer (milliseconds)
    -   `solvedCharacters`: string (JSON array of character IDs)

### Character Data

-   **Key:** `character:<character-id>`
-   **Type:** `HASH`
-   **Description:** The `game-api` maintains a hash for each character on the board. The `guesswhoclientapi` reads these hashes to build the public game state.
-   **Expected Fields:**
    -   `id`: string
    -   `imageUrl`: string
    -   `solvedByTeams`: string (JSON array of `{ teamId, color }` objects)

### Leaderboard

-   **Key:** `leaderboard`
-   **Type:** `SORTED SET`
-   **Description:** The `game-api` is solely responsible for maintaining an accurate, real-time leaderboard. The `guesswhoclientapi` reads from this sorted set to serve the leaderboard portion of the `/api/game/state` endpoint.
-   **Assumed Logic:** The `game-api` will use the `ZADD` command to update a team's score in the sorted set whenever their `totalScore` changes. The score of the set member is the team's total score, and the value is the team's ID (e.g., `team:<team-id>`).

## 2. Game Logic and Calculations

The `guesswhoclientapi` performs **no game logic calculations**. It assumes the `game-api` is responsible for:

-   **Score Calculation:** Computing all scores, including bonuses and penalties.
-   **Milestone Tracking:** Determining when a team has achieved a milestone.
-   **Answer Validation:** Validating submissions from teams.
-   **State Updates:** Atomically updating all relevant Redis keys (`team:*`, `character:*`, `leaderboard`) after a successful submission.

## 3. Real-Time Communication via Redis Pub/Sub

The `guesswhoclientapi` relies on Redis Pub/Sub to learn when to notify clients of updates.

-   **Channel:** The `guesswhoclientapi` subscribes to a channel named `game_events`.
-   **Publisher:** It assumes the `game-api` will `PUBLISH` a message to the `game_events` channel after any state change that should be reflected on the UI (e.g., a character is solved, the leaderboard changes).
-   **Message Contract:** The content of the published message is not important; its arrival is simply a signal to act. A simple message like `"update"` is sufficient.
-   **Client API Action:** Upon receiving a message on the `game_events` channel, the `guesswhoclientapi` will broadcast a Server-Sent Event (SSE) to all connected UI clients, telling them to refetch the game state.

## 4. Architectural Data Flow

The following diagram illustrates the assumed data flow between the services and Redis.

```mermaid
sequenceDiagram
    participant GameAPI as Game API (Write Service)
    participant Redis as Redis (Data Store + Pub/Sub)
    participant ClientAPI as Client-Facing API (Read Service)
    participant UI as Next.js UI

    Note over GameAPI: Team submits a correct answer
    GameAPI->>Redis: 1. ZADD leaderboard (update score)
    GameAPI->>Redis: 2. HSET team:<id> (update stats)
    GameAPI->>Redis: 3. HSET character:<id> (add solver)
    GameAPI->>Redis: 4. PUBLISH game_events "update"

    Redis-->>ClientAPI: 5. (Subscribed) Receives "update" message
    ClientAPI->>UI: 6. SSE Event: "GAME_UPDATE"

    UI->>ClientAPI: 7. GET /api/game/state
    ClientAPI->>Redis: 8. ZREVRANGE leaderboard
    ClientAPI->>Redis: 9. HGETALL character:<id>
    Redis-->>ClientAPI: 10. Return latest data
    ClientAPI-->>UI: 11. Respond with fresh game state