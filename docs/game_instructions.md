# Guess Who: Game Instructions

Welcome to the "Guess Who: Identity Under Fire" hackathon! This document explains how the game works and how your team can participate.

## 1. The Objective

The goal is simple: be the fastest and most efficient team to identify the hidden "target" character from a large board of candidates. You will compete against other teams in real-time to solve as many rounds as possible, earning points for speed, efficiency, and accuracy.

## 2. Getting Started

Before you can play, your team needs to register.

### Signing Up

1.  Navigate to the **Signup** page.
2.  Choose a unique team name and a password.
3.  Click "Sign Up". Your team will be assigned a unique color that will appear on the game board and leaderboard.

### Logging In

1.  Once registered, go to the **Login** page.
2.  Enter your team name and password.
3.  You will be taken to the main game interface.

## 3. The Game Interface

The main screen is divided into several key areas:

### The Game Board

This is the central grid displaying all 64 possible characters. When another team successfully identifies a character, their team color will appear on that character's tile, marking it as "solved." The board updates in real-time for all players.

### The Leaderboard

The leaderboard on the right-hand side shows the current rankings of all participating teams. Teams are ranked based on:

-   **Total Score:** The overall points accumulated.
-   **Solves:** The total number of characters correctly identified.
-   **Quickest Solve:** The fastest time your team has taken to solve a single round.

### Your Team's Progress

At the top of the screen, you can see your team's private statistics, including your current score, total solves, and any milestones you have achieved.

## 4. How to Play: The Core Loop

Identifying the target is not done through the UI. Instead, your team must build a program (e.g., a CLI application or a simple script) to interact with the **Game API**.

This is where the real challenge lies. Your program will need to:

1.  **Start a New Round:** Make an API call to begin a new session and get a `sessionId`.
2.  **Fetch the Board:** Download the full list of candidate characters and their traits for the current round.
3.  **Ask Questions:** Programmatically ask questions about the hidden target's traits (e.g., "What is their hair color?").
4.  **Handle Different Answers:** Some answers will be straightforward, while others may be encrypted or come from "flaky" endpoints that require error handling and retries.
5.  **Eliminate Candidates:** Use the answers you receive to narrow down the list of possible targets.
6.  **Submit Your Guess:** Once you believe you have identified the target, submit your final guess to the API.

**(Note: The detailed specification for the Game API, including endpoints for asking questions and submitting guesses, will be provided by the service-side team. This section will be updated once that information is available.)**

## 5. Milestones and Scoring

Your team earns points for various achievements throughout the game. While the full scoring model is detailed in the main solution document, the key ways to score are:

-   **Achieving Milestones:** Earn significant points for reaching key technical milestones, such as successfully asking a question or handling an encrypted answer.
-   **Correct Solves:** Earn points for each correct guess.
-   **Bonuses:** Receive bonus points for solving rounds quickly and using a minimal number of questions.

Good luck, and may the best team win!