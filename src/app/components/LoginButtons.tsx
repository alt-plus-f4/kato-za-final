import { cn } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

interface LoginButtonsProps {
	className?: string;
}

const LoginButtons = ({ className = '' }: LoginButtonsProps) => {
	return (
		<div className={cn('', className)}>
			<Link
				href='/sign-in'
				className={cn(
					buttonVariants({ variant: 'default' }),
					'px-2 mr-2 sm:py-3 sm:px-6 sm:mr-2'
				)}
			>
				SignIn
			</Link>
		</div>
	);
};

export default LoginButtons;
