import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const TEST_DATA = {
	piggyBank: {
		id: 999,
		money: 650,
		goalId: 999,
	},
	goal: {
		id: 999,
		userId: 999,
		name: 'Dream Vacation',
		description: 'Trip to Bali in summer 2024',
		price: 1000,
		picture: null,
	},
};

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

		console.log('User data:', user);

		if (!user || !user.piggyBank || !user.Goal) {
			console.log('No real data found, returning test data');
			return NextResponse.json(TEST_DATA);
		}

		return NextResponse.json({
			piggyBank: user.piggyBank,
			goal: user.Goal,
		});
	} catch (error) {
		console.error('Error fetching piggy bank:', error);
		console.log('Error occurred, returning test data');
		return NextResponse.json(TEST_DATA);
	}
}
