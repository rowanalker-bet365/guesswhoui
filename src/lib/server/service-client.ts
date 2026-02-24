import 'server-only';

/**
 * A wrapper around `fetch` for making requests to the backend service.
 * Currently behaves like a standard `fetch` call but serves as a central point
 * for adding headers or other request logic in the future.
 *
 * @param input The resource that you wish to fetch.
 * @param init An object containing any custom settings that you want to apply to the request.
 * @returns A Promise that resolves to the Response to that request.
 */
export async function fetchFromService(
	input: RequestInfo | URL,
	init?: RequestInit
) {
	return fetch(input, init);
}

/**
 * A wrapper around `fetch` for making public requests to the backend service.
 *
 * @param input The resource that you wish to fetch.
 * @param init An object containing any custom settings that you want to apply to the request.
 * @returns A Promise that resolves to the Response to that request.
 */
export async function fetchPublic(
	input: RequestInfo | URL,
	init?: RequestInit
) {
	return fetch(input, init);
}
