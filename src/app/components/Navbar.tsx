import Link from 'next/link';
import { Coins } from 'lucide-react';
import { UserNav } from './UserNav';
import { getAuthSession } from '@/lib/auth';
import LoginButtons from './LoginButtons';

export default async function Header() {
	const session = await getAuthSession();

	return (
		<header className='px-4 lg:px-6 h-16 flex items-center justify-between border-b '>
			<div className='flex items-center gap-2 font-bold text-xl'>
				<Coins className='h-6 w-6 text-primary' />
				<span>PiggyBank</span>
			</div>
			<nav className='flex gap-4 sm:gap-6 items-center'>
				<Link
					href='/dashboard'
					className='text-sm font-medium hover:underline underline-offset-4'
				>
					Dashboard
				</Link>
				<Link
					href='#features'
					className='text-sm font-medium hover:underline underline-offset-4'
				>
					Features
				</Link>
				<Link
					href='#'
					className='text-sm font-medium hover:underline underline-offset-4'
				>
					About
				</Link>
				{session?.user ? (
					<div className='flex flex-row space-x-4 justify-center items-center'>
						<UserNav user={session.user} />
					</div>
				) : (
					<LoginButtons className='flex flex-row sm:inline' />
				)}
			</nav>
		</header>
	);
}
