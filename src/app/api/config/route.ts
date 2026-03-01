import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Returns public runtime configuration values to client components.
 * This is necessary because NEXT_PUBLIC_ variables are only inlined at build
 * time; values injected at runtime (e.g. via Cloud Run env vars) must be
 * served through a server-side route like this one.
 */
export async function GET() {
  return NextResponse.json({
    serviceUrl: process.env.NEXT_PUBLIC_GUESSWHOSERVICE_URL ?? null,
  });
}