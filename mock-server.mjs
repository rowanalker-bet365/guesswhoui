import express from 'express';
import cors from 'cors';
import { handleApiRequest } from './src/lib/mock-api.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Mock SSE Stream
function createMockEventStream(req, res) {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.flushHeaders();

  console.log('[SSE Mock] Client connected.');

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  sendEvent('connection', { message: 'mock connection established' });

  const intervalId = setInterval(() => {
    sendEvent('BOARD_RESET', {
      message: 'Simulating a board reset from the mock server.',
      timestamp: new Date().toISOString(),
    });
  }, 30000);

  req.on('close', () => {
    clearInterval(intervalId);
    console.log('[SSE Mock] Client disconnected.');
  });
}

// All other API requests
app.all('/api/*', (req, res) => {
  const slug = req.path.replace('/api/', '');
  const search = req.url.split('?')[1] || '';

  if (slug === 'events' && req.method === 'GET') {
    return createMockEventStream(req, res);
  }

  const result = handleApiRequest(slug, req.method, req.body, search);
  res.status(result.status).json(result.body);
});

app.listen(port, () => {
  console.log(`[Mock Server] Running at http://localhost:${port}`);
});