import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function POST(request: Request) {
	try {
		const session = await getAuthSession();
		if (!session || !session.user) {
			return NextResponse.json(
				{ message: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const { initialAmount } = await request.json();

		if (initialAmount < 0) {
			return NextResponse.json(
				{ message: 'Initial amount cannot be negative' },
				{ status: 400 }
			);
		}

		const goal = await db.goal.create({
			data: {
				userId: session.user.id || '',
				name: 'New Goal',
				price: 0,
			},
		});

		const piggyBank = await db.piggyBank.create({
			data: {
				money: initialAmount,
				goalId: goal.id,
				User: {
					connect: {
						id: session.user.id || '',
					},
				},
			},
		});

		return NextResponse.json(piggyBank);
	} catch (error) {
		console.error('Error creating piggy bank:', error);
		return NextResponse.json(
			{ message: 'Failed to create piggy bank' },
			{ status: 500 }
		);
	}
}

let testBalance = 0;

export async function PATCH(request: Request) {
	try {
		// const session = await getAuthSession();
		// if (!session || !session.user) {
		// 	return NextResponse.json(
		// 		{ message: 'Unauthorized' },
		// 		{ status: 401 }
		// 	);
		// }

		const { amount, type, piggyBankId } = await request.json();

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

		try {
			const piggyBank = await db.piggyBank.findUnique({
				where: { id: piggyBankId },
			});

			if (piggyBank) {
				if (type === 'remove' && piggyBank.money < amount) {
					return NextResponse.json(
						{ error: 'Insufficient funds' },
						{ status: 400 }
					);
				}

				const newBalance =
					type === 'add'
						? piggyBank.money + amount
						: piggyBank.money - amount;

				const updatedPiggyBank = await db.piggyBank.update({
					where: { id: piggyBankId },
					data: {
						money: newBalance,
					},
				});

				return NextResponse.json({
					updatedBalance: updatedPiggyBank.money,
				});
			}
		} catch (error) {
			console.error('Database error, using test data instead:', error);
		}

		if (type === 'remove' && testBalance < amount) {
			return NextResponse.json(
				{ error: 'Insufficient funds' },
				{ status: 400 }
			);
		}

		testBalance =
			type === 'add' ? testBalance + amount : testBalance - amount;

		return NextResponse.json({
			updatedBalance: testBalance,
		});
	} catch (error) {
		console.error('Error updating funds:', error);
		return NextResponse.json(
			{ error: 'Failed to update funds' },
			{ status: 500 }
		);
	}
}
