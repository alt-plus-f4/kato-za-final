import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
	try {
		// Parse userId from query parameters
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get('userId');
		if (!userId) {
			return NextResponse.json(
				{ message: 'Missing userId parameter' },
				{ status: 400 }
			);
		}

		const user = await db.user.findUnique({
			where: { id: userId },
			include: {
				piggyBank: true,
				Goal: true,
			},
		});

		if (!user || !user.piggyBank || !user.Goal) {
			console.log('No real data found, returning test data');
			return NextResponse.error();
		}

		return NextResponse.json({
			piggyBank: user.piggyBank,
			goal: user.Goal,
		});
	} catch (error) {
		console.error('Error fetching piggy bank:', error);
		console.log('Error occurred, returning test data');
		return NextResponse.error();
	}
}
