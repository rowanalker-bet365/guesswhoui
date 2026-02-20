# New Implementation Plan & Consolidated Documentation

This document supersedes all previous architectural plans and serves as the single source of truth for the `guesswhoui` application's architecture and implementation.

#### 1. Core Architecture: Next.js with a BFF on Cloud Run

We will deploy the `guesswhoui` application as a **server-rendered Next.js application on Google Cloud Run**. This architecture provides the optimal balance of low cost, rapid development, and architectural simplicity for this project.

The key change is the **elimination of the separate `guesswhoclient` service**. Its responsibilities (serving game state and managing SSE connections) will be merged directly into the Next.js application, creating a true **Backend-for-Frontend (BFF)**.

**Architectural Diagram:**

```mermaid
graph TD
    subgraph "Google Cloud Platform"
        A[User's Browser] --> B[guesswhoui (Next.js on Cloud Run)];
        B -- "API Calls" --> C[guesswhoservice (Game API on Cloud Run)];
        B -- "Subscribes" --> D[Redis (Memorystore)];
        C -- "Publishes Updates" --> D;
    end

    subgraph "Real-time Data Flow"
        style C fill:#D5E8D4,stroke:#82B366
        style D fill:#F8CECC,stroke:#B85450
        style B fill:#DAE8FC,stroke:#6C8EBF
        style A fill:#E1D5E7,stroke:#9673A6

        C -- "1. Game state changes, publishes to Redis" --> D;
        D -- "2. Pushes message to subscriber" --> B;
        B -- "3. Sends Server-Sent Event (SSE) to browser" --> A;
    end
```

#### 2. Detailed Implementation Steps

**Phase 1: Application Refactoring**

1.  **Create Standalone Mock Server (Local Development Only):**
    *   Create `guesswhoui/mock-server.mjs` using `express`.
    *   This server will import and use the existing `handleApiRequest` function from `src/lib/mock-api.ts`.
    *   It will listen on port `3001`.

2.  **Update `package.json` for Concurrent Development:**
    *   Add `concurrently` as a dev dependency.
    *   Create a `dev:mock` script to run the mock server.
    *   Update the `dev` script to use `concurrently` to run both the Next.js dev server and the mock server.

3.  **Configure Next.js Rewrites for Local Proxying:**
    *   Modify `next.config.mjs` to use `rewrites` to proxy `/api/*` requests to the mock server at `http://localhost:3001` **only in development mode**.

4.  **Create the Real SSE Endpoint:**
    *   Create a new API route at `guesswhoui/src/app/api/events/route.ts`.
    *   This route will be responsible for:
        *   Establishing a connection to the Redis Pub/Sub channel (`game_events`).
        *   Listening for messages from the `guesswhoservice`.
        *   Streaming SSE events to the connected client.

5.  **Simplify Build Configuration:**
    *   The `next.config.mjs` will be simplified to remove all previous build workarounds. It will not contain any `output: 'export'` logic.
    *   The `package.json` `build` script will be simplified to just `next build`.

**Phase 2: Infrastructure & Deployment (Terraform)**

1.  **Update `guesswhoui` Terraform Module:**
    *   Modify the `guesswhoui` Terraform module (`terraform/modules/guesswhoui/main.tf`) to deploy a Docker container to Cloud Run instead of syncing files to a GCS bucket.
    *   This will involve:
        *   Adding a `google_cloud_run_v2_service` resource.
        *   Configuring the service to use the Docker image built by the CI pipeline.
        *   Ensuring the necessary environment variables (e.g., Redis connection details) are passed to the service.

2.  **Create a `Dockerfile` for `guesswhoui`:**
    *   Create a new `guesswhoui/Dockerfile` that defines the steps to build and run the Next.js application in a production environment. This will be a standard multi-stage Next.js Dockerfile.

3.  **Update CI/CD Pipeline (`.github/workflows/ci.yml`):**
    *   Modify the CI pipeline to:
        *   Build a Docker image for the `guesswhoui` application.
        *   Push the image to Google Artifact Registry.
        *   Trigger the Terraform deployment to update the Cloud Run service.

4.  **Delete `guesswhoclient` Resources:**
    *   The entire `terraform/modules/guesswhoclient` directory can be **deleted**.
    *   The corresponding module block in `terraform/environments/dev/main.tf` will also be removed.

#### 3. Revised API Contracts & Data Models

The API contracts defined in `api_contracts.md` remain largely the same, with one important change: the SSE endpoint is now officially part of the `guesswhoui` service.

*   **`GET /api/events`**: A new streaming endpoint hosted by the `guesswhoui` Next.js server. It subscribes to Redis Pub/Sub and streams game updates to the client.

All other endpoints (`/api/auth/login`, `/api/game/state`, etc.) will now be served directly by the `guesswhoservice` and will be accessed by the UI using the `NEXT_PUBLIC_API_BASE_URL` environment variable. The local mock server will mimic this behavior.