import 'server-only';

/**
 * A wrapper around `fetch` that was previously used for adding OIDC authentication.
 * The OIDC logic has been removed as it's considered legacy. This function is
 * kept for now as it's used in various API routes. It currently behaves like a
 * standard `fetch` call.
 *
 * @param input The resource that you wish to fetch.
 * @param init An object containing any custom settings that you want to apply to the request.
 * @returns A Promise that resolves to the Response to that request.
 */
export async function fetchWithAuth(
	input: RequestInfo | URL,
	init?: RequestInit
) {
	return fetch(input, init);
}
