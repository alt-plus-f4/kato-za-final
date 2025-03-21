import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Target, Plus } from 'lucide-react';
import Link from 'next/link';
import { PiggyBank } from '@/components/PiggyBank';
import fetchUserPiggybanks from '@/lib/fetch-user-piggybanks';
import { getAuthSession } from '@/lib/auth';

export default async function SavingsTracker() {
	const session = await getAuthSession();

	console.log(JSON.stringify(session));

	if (!session) {
		redirect('/signin');
	}

	const piggybanks = await fetchUserPiggybanks(session.user.id);
	const hasPiggyBank = piggybanks.length > 0;

	return (
		<div className='container mx-auto px-4 py-8 max-w-3xl'>
			{!hasPiggyBank ? (
				<div className='space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>Welcome to PiggyBank</CardTitle>
							<CardDescription>
								Get started by creating your first piggy bank
								and savings goal
							</CardDescription>
						</CardHeader>
						<CardContent className='flex flex-col items-center py-6'>
							<div className='bg-primary/10 rounded-full p-6 mb-4'>
								<Coins className='h-12 w-12 text-primary' />
							</div>
							<h3 className='text-xl font-semibold mb-2'>
								No Piggy Bank Found
							</h3>
							<p className='text-center text-muted-foreground mb-6 max-w-md'>
								Create your first piggy bank to start tracking
								your savings toward your goals.
							</p>
						</CardContent>
						<CardFooter className='flex justify-center pb-6'>
							<Button asChild>
								<Link href='/dashboard/add-piggybank'>
									<Plus className='mr-2 h-4 w-4' />
									Create Piggy Bank
								</Link>
							</Button>
						</CardFooter>
					</Card>

					<div className='grid gap-4 md:grid-cols-2'>
						<Card>
							<CardHeader>
								<div className='flex items-center gap-2'>
									<Coins className='h-5 w-5 text-primary' />
									<CardTitle className='text-lg'>
										Track Savings
									</CardTitle>
								</div>
							</CardHeader>
							<CardContent>
								<p className='text-sm text-muted-foreground'>
									Keep track of your savings progress and
									watch your money grow over time.
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className='flex items-center gap-2'>
									<Target className='h-5 w-5 text-primary' />
									<CardTitle className='text-lg'>
										Set Goals
									</CardTitle>
								</div>
							</CardHeader>
							<CardContent>
								<p className='text-sm text-muted-foreground'>
									Define clear savings goals with target
									amounts and visualize your progress.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			) : (
				<>
					<div className='flex justify-between items-center mb-6'>
						<h1 className='text-3xl font-bold'>Savings Tracker</h1>
						<div className='flex gap-2'>
							<Button variant='outline' size='sm' asChild>
								<Link href='/dashboard/add-goal'>
									<Target className='mr-2 h-4 w-4' />
									Update Goal
								</Link>
							</Button>
						</div>
					</div>

					<Suspense
						fallback={
							<div className='text-center p-8'>
								<p className='text-lg text-muted-foreground'>
									Loading your savings data...
								</p>
							</div>
						}
					>
						<PiggyBank initialData={piggybanks} />
					</Suspense>
				</>
			)}
		</div>
	);
}
