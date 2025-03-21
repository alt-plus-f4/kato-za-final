import { Coins } from 'lucide-react';

export default function Loading() {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen'>
			<Coins className='h-12 w-12 text-primary animate-pulse' />
			<h2 className='mt-4 text-xl font-semibold'>
				Loading add piggy bank form...
			</h2>
		</div>
	);
}
