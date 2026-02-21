import 'server-only';
import { GoogleAuth } from 'google-auth-library';

const GUESSWHOSERVICE_URL = process.env.NEXT_PUBLIC_GUESSWHOSERVICE_URL;

if (!GUESSWHOSERVICE_URL) {
  // In a browser context, this might not be set, and we'd rely on the relative /api path.
  // The OIDC token generation will only work in a server context where this is set.
  console.warn('NEXT_PUBLIC_GUESSWHOSERVICE_URL environment variable not set');
}

const auth = new GoogleAuth();

async function getOidcToken() {
  if (!GUESSWHOSERVICE_URL) {
    return null;
  }
  const client = await auth.getIdTokenClient(GUESSWHOSERVICE_URL);
  const res = await client.getRequestHeaders();
  return res.Authorization;
}

export async function fetchWithAuth(
	input: RequestInfo | URL,
	init?: RequestInit
) {
	const token = await getOidcToken();
	const headers = new Headers(init?.headers);
	if (token) {
		headers.set('Authorization', token);
	}

	return fetch(input, {
		...init,
		headers,
	});
}

export async function fetchPublic(input: RequestInfo | URL, init?: RequestInit) {
	return fetch(input, init);
}