import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { uploadImage } from '@/lib/uploadImage';
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

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;
		const price = Number.parseFloat(formData.get('price') as string);
		const piggyBankId = Number.parseInt(
			formData.get('piggyBankId') as string
		);
		const imageFile = formData.get('image') as File | null;

		if (!name) {
			return NextResponse.json(
				{ message: 'Goal name is required' },
				{ status: 400 }
			);
		}

		if (price <= 0) {
			return NextResponse.json(
				{ message: 'Price must be greater than zero' },
				{ status: 400 }
			);
		}

		let pictureUrl: string | null = null;
		if (imageFile) {
			// Pass the image file (a Blob) along with the provided name as the file name
			pictureUrl = await uploadImage(imageFile, name);
		}

		const piggyBank = await db.piggyBank.findUnique({
			where: { id: piggyBankId },
			select: { goalId: true },
		});

		if (!piggyBank) {
			return NextResponse.json(
				{ message: 'Piggy bank not found' },
				{ status: 404 }
			);
		}

		const goal = await db.goal.update({
			where: { id: piggyBank.goalId },
			data: {
				name,
				description,
				price,
				picture: pictureUrl,
			},
		});

		return NextResponse.json(goal);
	} catch (error) {
		console.error('Error creating/updating goal:', error);
		return NextResponse.json(
			{ message: 'Failed to create/update goal' },
			{ status: 500 }
		);
	}
}
