import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get('query');

	if (!query) {
		return NextResponse.json(
			{ error: 'Query is required' },
			{ status: 400 }
		);
	}

	const API_KEY = process.env.GOOGLE_API_KEY;
	const CX = process.env.GOOGLE_CSE_ID;

	const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${CX}&key=${API_KEY}`;

	try {
		const res = await fetch(apiUrl);
		const data = await res.json();

		const results =
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			data.items?.map((item: any) => ({
				title: item.title,
				link: item.link,
				snippet: item.snippet,
				displayLink: item.displayLink,
			})) || [];

		return NextResponse.json(results);
	} catch (error) {
		console.error('Failed to fetch search results:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch search results' },
			{ status: 500 }
		);
	}
}
