# Component Architecture

```mermaid
graph TD
    subgraph "User Interaction"
        UI[Next.js UI]
    end

    subgraph "API Layer"
        ClientAPI[guesswhoclientapi]
        GameAPI[game-api]
    end

    subgraph "Data & Communication Layer"
        Redis[(Redis)]
    end

    UI -- "HTTP Requests (Read-Only)" --> ClientAPI
    UI -- "SSE Connection" --> ClientAPI
    ClientAPI -- "Read Game State" --> Redis
    GameAPI -- "Write Game State" --> Redis
    GameAPI -- "Publish Events" --> Redis
    ClientAPI -- "Subscribe to Events" --> Redis

    style UI fill:#f9f,stroke:#333,stroke-width:2px
    style ClientAPI fill:#bbf,stroke:#333,stroke-width:2px
    style GameAPI fill:#bbf,stroke:#333,stroke-width:2px
    style Redis fill:#f8b,stroke:#333,stroke-width:2px