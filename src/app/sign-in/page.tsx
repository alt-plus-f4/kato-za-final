'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Coins, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export default function SignIn() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
	const error = searchParams.get('error');

	// Show error message if redirected with error
	if (error) {
		const errorMessage =
			error === 'CredentialsSignin'
				? 'Invalid email or password'
				: 'An error occurred during sign in';

		toast.error('Error', {
			description: errorMessage,
		});
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !password) {
			toast.error('Error', {
				description: 'Please enter both email and password',
			});
			return;
		}

		setIsLoading(true);

		try {
			const result = await signIn('credentials', {
				redirect: false,
				email,
				password,
				callbackUrl,
			});

			if (!result?.ok) {
				toast.error('Error', {
					description: 'Invalid email or password',
				});
				setIsLoading(false);
				return;
			}

			toast.success('Signed in', {
				description: 'You have successfully signed in',
			});

			router.push(callbackUrl);
			router.refresh();
		} catch (error) {
			console.error('Sign in error:', error);
			toast.error('Error', {
				description: 'An unexpected error occurred',
			});
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex flex-col items-center justify-center bg-background p-4'>
			<div className='w-full max-w-[450px] mx-auto'>
				<div className='bg-card border rounded-lg p-8 shadow-sm w-full'>
					<div className='flex flex-col items-center mb-8'>
						<div className='flex items-center gap-2 mb-2'>
							<Coins className='h-8 w-8 text-primary' />
							<span className='text-2xl font-bold'>
								PiggyBank
							</span>
						</div>
						<p className='text-sm text-muted-foreground mt-2'>
							Sign in to continue to PiggyBank
						</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-5'>
						<div className='space-y-4'>
							<div>
								<Input
									id='email'
									type='email'
									placeholder='Email'
									className='h-12'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>

							<div>
								<Input
									id='password'
									type='password'
									placeholder='Password'
									className='h-12'
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
								/>
							</div>
						</div>

						<div className='flex items-center justify-between'>
							<div className='flex items-center space-x-2'>
								<Checkbox
									id='remember'
									checked={rememberMe}
									onCheckedChange={(checked) =>
										setRememberMe(checked as boolean)
									}
								/>
								<label
									htmlFor='remember'
									className='text-sm font-normal cursor-pointer'
								>
									Stay signed in
								</label>
							</div>

							<Link
								href='/forgot-password'
								className='text-sm text-primary hover:text-primary/90'
							>
								Forgot password?
							</Link>
						</div>

						<div className='pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
							<div></div>
							<Button
								type='submit'
								className='bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px]'
								disabled={isLoading}
							>
								{isLoading ? (
									<Loader2 className='h-4 w-4 animate-spin' />
								) : (
									'Next'
								)}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
