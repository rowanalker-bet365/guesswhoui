# SSE Sync Strategy

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant ClientAPI as guesswhoclientapi
    participant RedisPubSub as Redis (Pub/Sub)
    participant GameAPI as game-api

    User->>UI: Submits an answer
    UI->>GameAPI: POST /submit-answer
    GameAPI->>RedisPubSub: 1. Writes updated score/state
    GameAPI->>RedisPubSub: 2. Publishes "data_updated" message
    
    RedisPubSub-->>ClientAPI: 3. Receives "data_updated" message
    ClientAPI-->>UI: 4. Sends SSE event ("data-updated")
    
    UI->>ClientAPI: 5. GET /game-state (to refresh data)
    ClientAPI->>RedisPubSub: 6. Reads latest game state
    RedisPubSub-->>ClientAPI: 7. Returns latest game state
    ClientAPI-->>UI: 8. Responds with latest game state