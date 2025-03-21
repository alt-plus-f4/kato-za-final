'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Coins, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AddPiggyBank() {
	const [initialAmount, setInitialAmount] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { data: session } = useSession();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (initialAmount < 0) {
			toast.error('Invalid amount', {
				description: 'Initial amount cannot be negative',
			});
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch('/api/piggybank', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					initialAmount,
					userId: session?.user?.id,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to create piggy bank');
			}

			const data = await response.json();

			toast.success('Piggy Bank Created', {
				description: `Your new piggy bank has been created with $${initialAmount}`,
			});

			router.push(`/dashboard/add-goal?piggyBankId=${data.id}`);
		} catch (error) {
			console.error('Error creating piggy bank:', error);
			toast.error('Error', {
				description:
					error instanceof Error
						? error.message
						: 'Failed to create piggy bank',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='container max-w-md m-auto py-10'>
			<Link
				href='/dashboard'
				className='inline-flex items-center text-sm text-primary hover:text-primary/90 mb-6'
			>
				<ArrowLeft className='mr-1 h-4 w-4' />
				Back to Dashboard
			</Link>

			<Card>
				<CardHeader>
					<div className='flex items-center gap-2 mb-2'>
						<Coins className='h-6 w-6 text-primary' />
						<CardTitle>Create a Piggy Bank</CardTitle>
					</div>
					<CardDescription>
						Start your savings journey by creating a new piggy bank
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='initialAmount'>
								Initial Amount ($)
							</Label>
							<Input
								id='initialAmount'
								type='number'
								step='0.01'
								min='0'
								placeholder='0.00'
								value={initialAmount}
								onChange={(e) =>
									setInitialAmount(
										Number.parseFloat(e.target.value) || 0
									)
								}
							/>
							<p className='text-xs text-muted-foreground'>
								Enter the initial amount you want to start with
							</p>
						</div>
					</CardContent>
					<CardFooter className='flex justify-between mt-2'>
						<Button
							variant='outline'
							type='button'
							onClick={() => router.push('/dashboard')}
							className='cursor-pointer'
						>
							Cancel
						</Button>
						<Button
							type='submit'
							disabled={isLoading}
							className='cursor-pointer'
						>
							{isLoading ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Creating...
								</>
							) : (
								'Create Piggy Bank'
							)}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
