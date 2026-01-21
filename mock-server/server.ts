import express from 'express';
import cors from 'cors';
import { mockCharacters, mockLeaderboard, mockTeam, mockStages, mockMetrics } from '../src/lib/mockData';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let clients: { id: number; res: express.Response }[] = [];

// --- API Endpoints ---

app.post('/api/auth/signup', (req, res) => {
  const { teamName } = req.body;
  console.log(`[Mock Server] Signup attempt for team: ${teamName}`);
  // In a real mock server, you might add the team to an in-memory array
  res.status(201).json({ message: 'Team created successfully' });
});

app.post('/api/auth/login', (req, res) => {
  const { teamName } = req.body;
  console.log(`[Mock Server] Login attempt for team: ${teamName}`);
  res.json({
    token: 'fake-jwt-token',
    team: { name: teamName, color: '#3b82f6' }, // Send back a mock team
  });
});

app.get('/api/game/state', (req, res) => {
  console.log('[Mock Server] Fetching game state');
  res.json(mockCharacters);
});

app.get('/api/game/leaderboard', (req, res) => {
  console.log('[Mock Server] Fetching leaderboard');
  res.json(mockLeaderboard);
});

app.get('/api/team/progress', (req, res) => {
  console.log('[Mock Server] Fetching team progress');
  res.json({
    team: mockTeam,
    metrics: mockMetrics,
    stages: mockStages,
    characters: mockCharacters.map(c => ({...c, isSolved: Math.random() > 0.5})),
  });
});

app.post('/api/team/reset', (req, res) => {
  console.log('[Mock Server] Resetting board');
  // Notify all connected clients of the change
  sendToAllClients({ type: 'BOARD_RESET' });
  res.status(200).json({ message: 'Board reset successfully' });
});


// --- Server-Sent Events (SSE) Endpoint ---

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  clients.push(newClient);
  console.log(`[Mock Server] Client ${clientId} connected`);

  // Send a welcome message
  res.write(`data: ${JSON.stringify({ type: 'WELCOME' })}\n\n`);

  req.on('close', () => {
    console.log(`[Mock Server] Client ${clientId} disconnected`);
    clients = clients.filter((c) => c.id !== clientId);
  });
});

function sendToAllClients(data: any) {
  console.log('[Mock Server] Sending update to all clients:', data);
  clients.forEach((c) => c.res.write(`data: ${JSON.stringify(data)}\n\n`));
}

// --- Server Start ---

app.listen(port, () => {
  console.log(`[Mock Server] Running at http://localhost:${port}`);
});

// Periodically send a mock update to all clients
setInterval(() => {
  const randomUpdate = {
    type: 'GAME_UPDATE',
    payload: {
      characterId: `c_${Math.floor(Math.random() * 64) + 1}`,
      teamId: `team${Math.floor(Math.random() * 5) + 1}`,
    },
  };
  sendToAllClients(randomUpdate);
}, 10000);