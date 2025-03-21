'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Target, ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import Image from 'next/image';

export default function AddGoal() {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState<number>(0);
	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();
	const searchParams = useSearchParams();
	const piggyBankId = searchParams.get('piggyBankId');
	const { data: session } = useSession();

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];

			// Check file size (limit to 5MB)
			if (file.size > 5 * 1024 * 1024) {
				toast.error('File too large', {
					description: 'Image must be less than 5MB',
				});
				return;
			}

			// Check file type
			if (!file.type.startsWith('image/')) {
				toast.error('Invalid file type', {
					description: 'Only image files are allowed',
				});
				return;
			}

			setImage(file);

			// Create preview
			const reader = new FileReader();
			reader.onload = (event) => {
				setImagePreview(event.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const removeImage = () => {
		setImage(null);
		setImagePreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name) {
			toast.error('Missing information', {
				description: 'Please provide a name for your goal',
			});
			return;
		}

		if (price <= 0) {
			toast.error('Invalid price', {
				description: 'Price must be greater than zero',
			});
			return;
		}

		if (!piggyBankId) {
			toast.error('Missing piggy bank', {
				description: 'No piggy bank ID provided',
			});
			return;
		}

		setIsLoading(true);

		try {
			// Create form data to handle file upload
			const formData = new FormData();
			formData.append('name', name);
			formData.append('description', description);
			formData.append('price', price.toString());
			formData.append('piggyBankId', piggyBankId);
			formData.append('userId', session?.user?.id || '');

			if (image) {
				formData.append('image', image);
			}

			const response = await fetch('/api/goal', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to create goal');
			}

			toast.success('Goal Created', {
				description: `Your new goal "${name}" has been created`,
			});

			// Redirect to dashboard
			router.push('/dashboard');
			router.refresh();
		} catch (error) {
			console.error('Error creating goal:', error);
			toast.error('Error', {
				description:
					error instanceof Error
						? error.message
						: 'Failed to create goal',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='container max-w-md mx-auto py-10'>
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
						<Target className='h-6 w-6 text-primary' />
						<CardTitle>Create a Goal</CardTitle>
					</div>
					<CardDescription>
						Set a savings goal to work towards
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='name'>Goal Name</Label>
							<Input
								id='name'
								placeholder='New Laptop'
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='description'>
								Description (Optional)
							</Label>
							<Textarea
								id='description'
								placeholder='Describe your goal...'
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={3}
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='price'>Target Amount ($)</Label>
							<Input
								id='price'
								type='number'
								step='0.01'
								min='0.01'
								placeholder='1000.00'
								value={price}
								onChange={(e) =>
									setPrice(
										Number.parseFloat(e.target.value) || 0
									)
								}
								required
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='image'>Goal Image (Optional)</Label>
							<div className='flex flex-col items-center gap-4'>
								{imagePreview ? (
									<div className='relative w-full h-40 bg-muted rounded-md overflow-hidden'>
										<Image
											src={imagePreview}
											alt='Goal preview'
											className='w-full h-full object-contain'
											width={200}
											height={200}
										/>
										<Button
											type='button'
											variant='destructive'
											size='icon'
											className='absolute top-2 right-2 h-8 w-8 rounded-full'
											onClick={removeImage}
										>
											<X className='h-4 w-4' />
										</Button>
									</div>
								) : (
									<div
										className='w-full h-40 border-2 border-dashed border-muted-foreground/25 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors'
										onClick={() =>
											fileInputRef.current?.click()
										}
									>
										<Upload className='h-10 w-10 text-muted-foreground/50' />
										<p className='text-sm text-muted-foreground mt-2'>
											Click to upload an image
										</p>
										<p className='text-xs text-muted-foreground/75'>
											PNG, JPG or GIF (max 5MB)
										</p>
									</div>
								)}
								<input
									ref={fileInputRef}
									id='image'
									type='file'
									accept='image/*'
									className='hidden'
									onChange={handleImageChange}
								/>
							</div>
						</div>
					</CardContent>
					<CardFooter className='flex justify-between'>
						<Button
							variant='outline'
							type='button'
							onClick={() => router.push('/dashboard')}
						>
							Cancel
						</Button>
						<Button type='submit' disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Creating...
								</>
							) : (
								'Create Goal'
							)}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
