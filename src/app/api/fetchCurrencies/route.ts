import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const apiKey = process.env.FIXER_API_KEY;
		const url = `http://data.fixer.io/api/symbols?access_key=${apiKey}`;

		const response = await fetch(url);
		const data = await response.json();

		if (!data.success) {
			throw new Error(
				data.error?.info || 'Failed to fetch currency symbols'
			);
		}

		return NextResponse.json({ symbols: data.symbols });
	} catch (error) {
		console.error('Error fetching currency symbols:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch currency symbols' },
			{ status: 500 }
		);
	}
}
