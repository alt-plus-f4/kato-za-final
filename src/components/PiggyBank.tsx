'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Plus, Minus, DollarSign, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Image from 'next/image';

type PiggyBankProps = {
	initialData: {
		piggyBank: {
			id: number;
			money: number;
			goalId: number;
		};
		goal: {
			id: number;
			name: string;
			description?: string | null;
			price: number;
			picture?: string | null;
		};
	};
};

export function PiggyBank({ initialData }: PiggyBankProps) {
	const [balance, setBalance] = useState(initialData.piggyBank.money);
	const [amount, setAmount] = useState(10);
	const [goal] = useState(initialData.goal);
	const [progress, setProgress] = useState(
		Math.min(
			(initialData.piggyBank.money / initialData.goal.price) * 100,
			100
		)
	);
	const [isUpdatingFunds, setIsUpdatingFunds] = useState(false);

	const updateBalance = async (type: 'add' | 'remove') => {
		if (amount <= 0) {
			toast.error('Invalid amount', {
				description: 'Please enter a positive amount',
			});
			return;
		}

		if (type === 'remove' && balance < amount) {
			toast.error('Insufficient funds', {
				description: "You don't have enough money in your piggy bank",
			});
			return;
		}

		try {
			setIsUpdatingFunds(true);
			const response = await fetch('/api/piggybank', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					amount,
					type,
					piggyBankId: initialData.piggyBank.id,
				}),
			});

			if (!response.ok) {
				throw new Error(`Failed to ${type} funds`);
			}

			const data = await response.json();
			setBalance(data.updatedBalance);

			if (goal && goal.price > 0) {
				const progressValue = Math.min(
					(data.updatedBalance / goal.price) * 100,
					100
				);
				setProgress(progressValue);
			}

			toast.success('Success', {
				description: `${
					type === 'add' ? 'Added' : 'Removed'
				} ${formatCurrency(amount)} ${
					type === 'add' ? 'to' : 'from'
				} your piggy bank`,
			});
		} catch (error) {
			console.error(`Error ${type}ing funds:`, error);
			toast.error('Error', {
				description: `Failed to ${type} funds`,
			});
		} finally {
			setIsUpdatingFunds(false);
		}
	};

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(value);
	};

	return (
		<div className='grid gap-6 md:grid-cols-2'>
			{/* Balance Card */}
			<Card>
				<CardHeader>
					<CardTitle>Your Balance</CardTitle>
					<CardDescription>
						Add or remove funds from your savings
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex items-center justify-center mb-6'>
						<div className='text-4xl font-bold flex items-center'>
							<DollarSign className='h-8 w-8 mr-1' />
							{formatCurrency(balance).replace('$', '')}
						</div>
					</div>

					<div className='flex items-center gap-4 mb-4'>
						<Input
							type='number'
							value={amount}
							onChange={(e) =>
								setAmount(
									Number.parseFloat(e.target.value) || 0
								)
							}
							min='0'
							step='5'
							className='text-right'
						/>
						<Button
							onClick={() => updateBalance('add')}
							className='flex-1'
							disabled={isUpdatingFunds}
						>
							{isUpdatingFunds ? (
								<span>Updating...</span>
							) : (
								<>
									<Plus className='mr-2 h-4 w-4' /> Add
								</>
							)}
						</Button>
						<Button
							onClick={() => updateBalance('remove')}
							variant='outline'
							className='flex-1'
							disabled={isUpdatingFunds || balance < amount}
						>
							{isUpdatingFunds ? (
								<span>Updating...</span>
							) : (
								<>
									<Minus className='mr-2 h-4 w-4' /> Remove
								</>
							)}
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Goal Product Card */}
			<Card>
				<CardHeader>
					<CardTitle>Goal Product</CardTitle>
					<CardDescription>What you are saving for</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex flex-col items-center'>
						<div className='w-full h-40 bg-muted rounded-md mb-4 overflow-hidden'>
							{goal.picture ? (
								<Image
									src={goal.picture}
									alt={goal.name}
									className='w-full h-full object-contain'
									width={200}
									height={200}
								/>
							) : (
								<div className='w-full h-full flex items-center justify-center text-muted-foreground'>
									No image available
								</div>
							)}
						</div>
						<h3 className='text-xl font-semibold'>{goal.name}</h3>
						{goal.description && (
							<p className='text-sm text-muted-foreground text-center mt-1 mb-2'>
								{goal.description}
							</p>
						)}
						<p className='text-lg font-bold text-primary'>
							{formatCurrency(goal.price)}
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Progress Section */}
			<Card className='md:col-span-2 mt-2'>
				<CardHeader>
					<CardTitle>Savings Progress</CardTitle>
					<CardDescription>
						{balance >= goal.price
							? 'Congratulations! You can now purchase your goal item!'
							: `You need ${formatCurrency(
									goal.price - balance
							  )} more to reach your goal`}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Progress value={progress} className='h-4' />
					<div className='flex justify-between mt-2 text-sm text-muted-foreground'>
						<span>0%</span>
						<span>50%</span>
						<span>100%</span>
					</div>
				</CardContent>
				<CardFooter>
					<Button
						className={cn(
							'w-full',
							balance < goal.price &&
								'opacity-50 cursor-not-allowed'
						)}
						disabled={balance < goal.price}
					>
						<ShoppingBag className='mr-2 h-4 w-4' />
						{balance >= goal.price
							? 'Purchase Now!'
							: 'Keep Saving'}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
