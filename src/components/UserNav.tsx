'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, Users } from 'lucide-react';
import SignOut from './SignOut';
import Image from 'next/image';

interface UserNavProps {
	user: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
}

export function UserNav(UserNavProps: UserNavProps) {
	const { user } = UserNavProps;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					className='relative h-8 w-8 rounded-full'
				>
					<Avatar className='h-8 w-8'>
						<AvatarImage src={user.image ?? ''} alt='image' />
						<AvatarFallback>
							<Image
								src='https://6q0iedxcfemxlbr8.public.blob.vercel-storage.com/avatars/image-avatar-avatar-fallback-aqe7YOpWnJZHFpWfZTD8WvUfaEhkSJ.svg'
								alt='avatar fallback'
								width={32}
								height={32}
							/>
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56' align='end' forceMount>
				<DropdownMenuLabel className='font-normal'>
					<div className='flex flex-col space-y-1'>
						<p className='text-sm font-medium leading-none'>
							{user.name}
						</p>
						<p className='text-xs leading-none text-muted-foreground'>
							{user.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<a href='/profile'>
							<Users />
							<span>Profile</span>
						</a>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Settings />
						<span>Settings</span>
						<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<SignOut />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
