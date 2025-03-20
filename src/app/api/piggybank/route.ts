import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

//! For demo purposes, we'll use a hardcoded user ID
//! In a real app, you would get this from the authenticated user session
const CURRENT_USER_ID = 1;

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
		picture:
			'https://balidave.com/wp-content/uploads/2022/11/best-hotel-bali.jpeg',
	},
};

export async function GET() {
	try {
		const user = await db.user.findUnique({
			where: { id: CURRENT_USER_ID },
			include: {
				piggyBank: true,
				Goal: true,
			},
		});

		//! If no real data is found, return test data
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
		//! If there's an error (like no database connection), return test data
		console.log('Error occurred, returning test data');
		return NextResponse.json(TEST_DATA);
	}
}

// export async function GET() {
// 	try {
// 		const user = await db.user.findUnique({
// 			where: { id: CURRENT_USER_ID },
// 			include: {
// 				piggyBank: true,
// 				Goal: true,
// 			},
// 		});

// 		if (!user) {
// 			return NextResponse.json(
// 				{ error: 'User not found' },
// 				{ status: 404 }
// 			);
// 		}

// 		if (!user.piggyBank) {
// 			return NextResponse.json(
// 				{ error: 'Piggy bank not found' },
// 				{ status: 404 }
// 			);
// 		}

// 		return NextResponse.json({
// 			piggyBank: user.piggyBank,
// 			goal: user.Goal,
// 		});
// 	} catch (error) {
// 		console.error('Error fetching piggy bank:', error);
// 		return NextResponse.json(
// 			{ error: 'Failed to fetch piggy bank data' },
// 			{ status: 500 }
// 		);
// 	}
// }

export async function PATCH(request: Request) {
	try {
		const { amount, type } = await request.json();

		if (typeof amount !== 'number' || amount <= 0) {
			return NextResponse.json(
				{ error: 'Invalid amount' },
				{ status: 400 }
			);
		}

		if (type !== 'add' && type !== 'remove') {
			return NextResponse.json(
				{ error: 'Invalid operation type' },
				{ status: 400 }
			);
		}

		const user = await db.user.findUnique({
			where: { id: CURRENT_USER_ID },
			include: {
				piggyBank: true,
			},
		});

		if (!user || !user.piggyBank) {
			return NextResponse.json(
				{ error: 'Piggy bank not found' },
				{ status: 404 }
			);
		}

		if (type === 'remove' && user.piggyBank.money < amount) {
			return NextResponse.json(
				{ error: 'Insufficient funds' },
				{ status: 400 }
			);
		}

		const newBalance =
			type === 'add'
				? user.piggyBank.money + amount
				: user.piggyBank.money - amount;

		const updatedPiggyBank = await db.piggyBank.update({
			where: { id: user.piggyBank.id },
			data: {
				money: newBalance,
			},
		});

		return NextResponse.json({
			updatedBalance: updatedPiggyBank.money,
		});
	} catch (error) {
		console.error('Error updating funds:', error);
		return NextResponse.json(
			{ error: 'Failed to update funds' },
			{ status: 500 }
		);
	}
}
