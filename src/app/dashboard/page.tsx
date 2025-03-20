import { Suspense } from 'react';
import { PiggyBank } from '@/components/PiggyBank';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Coins } from 'lucide-react';
import Link from 'next/link';

async function getUserData() {
	try {
		const response = await fetch(
			`${
				process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
			}/api/piggybank`,
			{
				cache: 'no-store',
			}
		);

		if (!response.ok) {
			throw new Error('Failed to fetch data');
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching user data:', error);
		return null;
	}
}

export default async function SavingsTracker() {
	const userData = await getUserData();

	if (!userData) {
		return (
			<div className='container mx-auto px-4 py-8 max-w-3xl'>
				<header className='flex items-center mb-8'>
					<Link
						href='/'
						className='flex items-center gap-2 font-bold text-xl'
					>
						<Coins className='h-6 w-6 text-primary' />
						<span>PiggyBank</span>
					</Link>
				</header>
				<Card>
					<CardHeader>
						<CardTitle>No Data Found</CardTitle>
						<CardDescription>
							We could not find your savings data
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className='text-center mb-4'>
							You do not have any savings goal or piggy bank set
							up yet. Please create a goal to start saving.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-8 max-w-3xl'>
			<header className='flex items-center mb-8'>
				<Link
					href='/'
					className='flex items-center gap-2 font-bold text-xl'
				>
					<Coins className='h-6 w-6 text-primary' />
					<span>PiggyBank</span>
				</Link>
			</header>

			<h1 className='text-3xl font-bold text-center mb-8'>
				Savings Tracker
			</h1>

			<Suspense
				fallback={
					<div className='text-center p-8'>
						<p className='text-lg text-muted-foreground'>
							Loading your savings data...
						</p>
					</div>
				}
			>
				<PiggyBank initialData={userData} />
			</Suspense>
		</div>
	);
}
