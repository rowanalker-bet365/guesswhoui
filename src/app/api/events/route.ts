import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';

export const dynamic = 'force-dynamic'; // Ensure this route is not statically built

// This endpoint is intentionally unauthenticated. The SSE stream only emits
// notification triggers (e.g. "something changed") — it does not contain any
// sensitive data. Clients react to these events by refetching from the actual
// data endpoints (/api/game/master-board, /api/game/leaderboard, /api/team/progress),
// each of which enforces its own auth where required. Keeping this open allows
// unauthenticated spectators on the home page to receive real-time board updates.
async function handler(req: NextRequest) {
  if (req.headers.get('accept') !== 'text/event-stream') {
    return new NextResponse('Request must be for an event stream.', { status: 400 });
  }

  let keepAliveInterval: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const redisClient = createClient({
        url: process.env.REDIS_URL,
      });

      redisClient.on('error', (err) => {
        console.error('Redis Client Error', err);
        controller.close();
      });

      await redisClient.connect();
      console.log('[SSE] Connected to Redis.');

      const pubSub = redisClient.duplicate();
      await pubSub.connect();

      await pubSub.subscribe('game_updates', (message) => {
        console.log(`[SSE] Received message from Redis: ${message}`);
        controller.enqueue(encoder.encode(`event: game_update\n`));
        controller.enqueue(encoder.encode(`data: ${message}\n\n`));
      });

      // Send a connection confirmation message
      controller.enqueue(encoder.encode(`event: connection\n`));
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ message: 'SSE connection established' })}\n\n`));

      keepAliveInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': keepalive\n\n'));
        } catch {
          clearInterval(keepAliveInterval!);
        }
      }, 15000);

      req.signal.addEventListener('abort', () => {
        console.log('[SSE] Client disconnected.');
        if (keepAliveInterval) {
          clearInterval(keepAliveInterval);
          keepAliveInterval = null;
        }
        pubSub.unsubscribe('game_updates');
        pubSub.quit();
        redisClient.quit();
        controller.close();
      });
    },
    cancel() {
      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
        keepAliveInterval = null;
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}

export { handler as GET };