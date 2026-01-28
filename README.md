# Guess Who? - Programming Challenge UI

This project is a React-based user interface for a "Guess Who?" programming challenge. It serves as a live dashboard for multiple teams competing in the event, providing real-time updates on their progress.

## Features

- **Homepage:** A public dashboard showing a 64-character game board, a color key for participating teams, and a live leaderboard.
- **Login/Signup:** A simple authentication system for teams to access their dedicated pages.
- **Team Page:** A protected page for each team, showing detailed progression metrics, stage completion times, a running timer, and a personalized game board highlighting their solved characters.
- **Live Updates:** All data on the homepage and team pages is synchronized in real-time using Server-Sent Events (SSE).

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 14 (with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Zustand](httpss://github.com/pmndrs/zustand) (with React Context)
- **Data Fetching:** [SWR](httpss://swr.vercel.app/)
- **Real-time:** Server-Sent Events (SSE)
- **UI Components:** Built using Atomic Design principles.

## Project Structure

The project is organized into the following main directories:

-   `mock-server/`: A simple Express.js server that mimics the backend API for development purposes.
-   `public/`: Static assets.
-   `src/app/`: Next.js App Router pages and layouts.
-   `src/components/`: React components, organized by the Atomic Design methodology (`atoms`, `molecules`, `organisms`).
-   `src/contexts/`: React context providers (e.g., for the Zustand store).
-   `src/hooks/`: Custom React hooks (`useGameEvents`, `useTimer`).
-   `src/lib/`: Helper functions, API client, and mock data.
-   `src/store/`: Zustand store definition and type declarations.

## Getting Started

### Prerequisites

-   [Node.js](httpss://nodejs.org/) (v18 or later)
-   [npm](httpss://www.npmjs.com/)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://gitlab.com/hillsidetech/pam/verification/hackathon-projects/guesswho/guesswhoui.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd guesswhoui
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Development Servers

This project requires two terminals to run simultaneously: one for the Next.js frontend and one for the mock Express.js backend.

1.  **Start the Mock Server:**
    In your first terminal, run:
    ```bash
    npm run dev:server
    ```
    This will start the mock API server on `http://localhost:3001`.

2.  **Start the Frontend:**
    In your second terminal, run:
    ```bash
    npm run dev
    ```
    This will start the Next.js development server on `http://localhost:3000`.

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

-   `npm run dev`: Starts the Next.js development server.
-   `npm run dev:server`: Starts the mock Express.js server.
-   `npm run build`: Builds the application for production.
-   `npm run start`: Starts a production server.
-   `npm run lint`: Lints the codebase using ESLint.
