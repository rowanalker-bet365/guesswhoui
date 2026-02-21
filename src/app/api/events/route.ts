import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';

export const dynamic = 'force-dynamic'; // Ensure this route is not statically built

async function handler(req: NextRequest) {
  if (req.headers.get('accept') !== 'text/event-stream') {
    return new NextResponse('Request must be for an event stream.', { status: 400 });
  }

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
        controller.enqueue(encoder.encode(`event: GAME_UPDATE\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ message })}\n\n`));
      });

      // Send a connection confirmation message
      controller.enqueue(encoder.encode(`event: connection\n`));
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ message: 'SSE connection established' })}\n\n`));

      req.signal.addEventListener('abort', () => {
        console.log('[SSE] Client disconnected.');
        pubSub.unsubscribe('game_updates');
        pubSub.quit();
        redisClient.quit();
        controller.close();
      });
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