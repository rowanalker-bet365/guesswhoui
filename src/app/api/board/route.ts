import { fetchFromService } from '@/lib/server/service-client';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/board:
 *   get:
 *     summary: Fetches the master game board
 *     description: Retrieves the initial state of the game board, including all characters, which is displayed on the homepage. This is a public endpoint and does not require authentication.
 *     tags:
 *       - Board
 *     responses:
 *       200:
 *         description: The master game board state.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 characters:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Character'
 *       500:
 *         description: Internal server error.
 */
export async function GET(request: Request) {
	const GUESSWHOSERVICE_URL = process.env.NEXT_PUBLIC_GUESSWHOSERVICE_URL;

	if (!GUESSWHOSERVICE_URL) {
		console.error('NEXT_PUBLIC_GUESSWHOSERVICE_URL environment variable not set');
		return NextResponse.json(
			{ message: 'Application is not configured correctly.' },
			{ status: 500 }
		);
	}

	try {
		const url = `${GUESSWHOSERVICE_URL}/v1/board`;
		const res = await fetchFromService(url);

		if (!res.ok) {
			const errorBody = await res.text();
			console.error(
				`Error fetching master board from service: ${res.status} ${res.statusText}`,
				errorBody
			);
			return NextResponse.json(
				{ message: `Failed to fetch master board. Status: ${res.status}` },
				{ status: res.status }
			);
		}

		const data = await res.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error(`API route /api/board failed:`, error);
		return NextResponse.json(
			{ message: 'An internal error occurred while fetching the master board.' },
			{ status: 500 }
		);
	}
}