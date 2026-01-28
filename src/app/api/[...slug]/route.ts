import { NextRequest, NextResponse } from 'next/server';
import { handleApiRequest } from '@/lib/mock-api';

const REAL_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Creates a mock Server-Sent Events stream for the development environment.
 */
function createMockEventStream(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      console.log('[SSE Mock] Client connected.');

      const sendEvent = (event: string, data: object) => {
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      sendEvent('connection', { message: 'mock connection established' });

      const intervalId = setInterval(() => {
        sendEvent('BOARD_RESET', {
          message: 'Simulating a board reset from the mock server.',
          timestamp: new Date().toISOString(),
        });
      }, 30000);

      req.signal.addEventListener('abort', () => {
        clearInterval(intervalId);
        controller.close();
        console.log('[SSE Mock] Client disconnected.');
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

async function handler(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const slug = pathname.replace('/api/', '');
  const method = req.method;

  // --- Development Logic ---
  if (process.env.NODE_ENV === 'development') {
    // Handle mock SSE connection
    if (slug === 'events' && method === 'GET') {
      return createMockEventStream(req);
    }
    // Handle all other mock API requests
    let body;
    if (method !== 'GET' && method !== 'HEAD') {
      try {
        body = await req.json();
      } catch (e) {
        body = null;
      }
    }
    const result = handleApiRequest(slug, method, body, search);
    return NextResponse.json(result.body, { status: result.status });
  }

  // --- Production/UAT Logic ---
  if (!REAL_API_URL) {
    console.error('Real API URL is not defined for non-development environment.');
    return new NextResponse('API URL not configured', { status: 500 });
  }

  const url = `${REAL_API_URL}/${slug}${search}`;

  // The generic proxy handles all requests, including the 'events' SSE stream.
  // `fetch` supports streaming responses, so this works for SSE.
  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.get('Authorization') || '',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined,
      // @ts-ignore - duplex is required for streaming proxy
      duplex: 'half',
    });

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse('Proxy error', { status: 500 });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };