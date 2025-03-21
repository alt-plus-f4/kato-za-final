import { Button } from '@/components/ui/button';
import { ArrowRight, Coins, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { FaGithub, FaInstagram } from 'react-icons/fa';
import { CiMail } from 'react-icons/ci';

export default function LandingPage() {
	return (
		<div className='flex flex-col min-h-screen'>
			{/* Hero Section */}
			<section className='w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted flex flex-row'>
				<div className='flex flex-col lg:flex-row items-center justify-around w-full mx-10 gap-2'>
					<div className='flex flex-col justify-center space-y-4'>
						<div className='space-y-2 text-center lg:text-left'>
							<h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none'>
								Save for what matters most
							</h1>
							<p className='max-w-[600px] text-muted-foreground md:text-xl'>
								Track your savings goals, visualize your
								progress, and achieve your dreams faster with
								our smart piggy bank.
							</p>
						</div>
						<div className='flex lg:block justify-center'>
							<Link href='/dashboard'>
								<Button size='lg' className='mx-2'>
									Get Started{' '}
									<ArrowRight className='h-4 w-4' />
								</Button>
							</Link>
							<Link href='#features'>
								<Button
									size='lg'
									variant='outline'
									className='mx-2'
								>
									Learn More
								</Button>
							</Link>
						</div>
					</div>
					<div className='hidden items-center justify-center md:flex md:w-1/3 lg:w-1/2 mt-2'>
						<div className='relative w-full max-w-[500px] aspect-square'>
							<div className='absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl' />
							<div className='relative bg-muted rounded-xl overflow-hidden border shadow-xl w-full h-full flex items-center justify-center'>
								<div className='w-3/4 h-3/4 bg-background rounded-lg p-6 flex flex-col items-center justify-center gap-4'>
									<Coins className='h-16 w-16 text-primary' />
									<div className='w-full bg-muted rounded-full h-4 overflow-hidden'>
										<div
											className='bg-primary h-full rounded-full'
											style={{ width: '65%' }}
										></div>
									</div>
									<p className='text-xl font-bold'>
										$650 / $1000
									</p>
									<p className='text-muted-foreground text-center'>
										Dream Vacation Fund
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section
				id='features'
				className='w-full py-12 md:py-24 lg:py-32 bg-background flex justify-center'
			>
				<div className='container px-4 md:px-6'>
					<div className='flex flex-col items-center justify-center space-y-4 text-center'>
						<div className='space-y-2'>
							<div className='inline-block rounded-lg bg-muted px-3 py-1 text-sm'>
								Features
							</div>
							<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
								Everything you need to save smarter
							</h2>
							<p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
								Our savings tracker helps you visualize your
								progress and stay motivated to reach your
								financial goals.
							</p>
						</div>
					</div>
					<div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12'>
						<div className='flex flex-col items-center space-y-4 text-center'>
							<div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
								<Target className='h-8 w-8 text-primary' />
							</div>
							<div className='space-y-2'>
								<h3 className='text-xl font-bold'>
									Set Clear Goals
								</h3>
								<p className='text-muted-foreground'>
									Define what you are saving for with specific
									targets and timeframes.
								</p>
							</div>
						</div>
						<div className='flex flex-col items-center space-y-4 text-center'>
							<div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
								<TrendingUp className='h-8 w-8 text-primary' />
							</div>
							<div className='space-y-2'>
								<h3 className='text-xl font-bold'>
									Track Progress
								</h3>
								<p className='text-muted-foreground'>
									Visualize your savings journey with
									beautiful progress indicators.
								</p>
							</div>
						</div>
						<div className='flex flex-col items-center space-y-4 text-center'>
							<div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
								<Coins className='h-8 w-8 text-primary' />
							</div>
							<div className='space-y-2'>
								<h3 className='text-xl font-bold'>
									Smart Saving
								</h3>
								<p className='text-muted-foreground'>
									Get insights and recommendations to help you
									save faster.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* About Us Section */}
			<section
				id='about'
				className='w-full py-12 md:py-24 lg:py-32 bg-background border-t flex justify-center'
			>
				<div className='container px-4 md:px-6'>
					<div className='flex flex-col items-center justify-center space-y-4 text-center'>
						<div className='space-y-2'>
							<div className='inline-block rounded-lg bg-muted px-3 py-1 text-sm'>
								About Us
							</div>
							<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
								The team behind PiggyBank
							</h2>
							<p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
								MyPiggyBank is an innovative piggy bank that
								combines a physical device and a mobile
								application to provide a convenient and modern
								way to manage savings. The user drops coins or
								banknotes into the piggy bank, which
								automatically recognizes and records the amount.
								The data is then synchronized with a website,
								allowing the user to monitor their available
								funds in real time.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='w-full py-12 md:py-24 lg:py-32 bg-muted flex justify-center'>
				<div className='container px-4 md:px-6'>
					<div className='flex flex-col items-center justify-center space-y-4 text-center'>
						<div className='space-y-2'>
							<h2 className='text-3xl font-bold tracking-tighter md:text-4xl/tight'>
								Ready to start saving?
							</h2>
							<p className='max-w-[600px] text-muted-foreground md:text-xl'>
								Join thousands of users who are achieving their
								financial goals with PiggyBank.
							</p>
						</div>
						<div className='flex flex-col gap-2 min-[400px]:flex-row'>
							<Link href='/dashboard'>
								<Button size='lg' className='gap-1.5'>
									Get Started{' '}
									<ArrowRight className='h-4 w-4' />
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className='flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6 '>
				<div className='flex items-center gap-2 font-semibold'>
					<Coins className='h-5 w-5 text-primary' />
					<p>PiggIBank &copy; {new Date().getFullYear()}</p>
				</div>
				<nav className='sm:ml-auto flex gap-4 sm:gap-6'>
					<Link href='https://github.com/alt-plus-f4/kato-za-final'>
						<FaGithub className='w-7 h-7 hover:text-blue-400 transition-colors' />
					</Link>
					<Link href='https://www.instagram.com/valhalkata/'>
						<FaInstagram className='w-7 h-7 hover:text-yellow-300 transition-colors' />
					</Link>
					<Link href='mailto:valentin@asenov.dev'>
						<CiMail className='w-7 h-7 hover:text-red-400 transition-colors' />
					</Link>
				</nav>
			</footer>
		</div>
	);
}
