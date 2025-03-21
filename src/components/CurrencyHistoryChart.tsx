'use client';

import { useState, useEffect, useRef } from 'react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import {
	ResponsiveContainer,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	Brush,
} from 'recharts';

const CurrencyHistoryChart = () => {
	const [from, setFrom] = useState('USD');
	const [to, setTo] = useState('EUR');
	const [days, setDays] = useState(30);
	const [currencies, setCurrencies] = useState<Record<string, string>>({});
	const [data, setData] = useState<{ t: number; c: number }[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	// Simple cache: key is "from-to-days"
	const cacheRef = useRef<Record<string, { t: number; c: number }[]>>({});

	useEffect(() => {
		const fetchCurrencies = async () => {
			try {
				const response = await fetch('/api/fetchCurrencies');
				const result = await response.json();

				if (!response.ok) {
					throw new Error(
						result.error || 'Failed to fetch currencies'
					);
				}

				setCurrencies(result.symbols);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				console.error('Failed to fetch currencies:', error);
				setError('Failed to fetch currencies. Please try again.');
			}
		};

		fetchCurrencies();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			if (!from || !to) return;

			const cacheKey = `${from}-${to}-${days}`;
			if (cacheRef.current[cacheKey]) {
				setData(cacheRef.current[cacheKey]);
				return;
			}

			setLoading(true);
			setError(null);

			try {
				const response = await fetch(
					`/api/currencyHistory?from=${from}&to=${to}&days=${days}`
				);
				const result = await response.json();

				if (!response.ok) {
					throw new Error(
						result.error || 'Failed to fetch historical data'
					);
				}

				setData(result);
				// Cache the response
				cacheRef.current[cacheKey] = result;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				console.error('Failed to fetch historical data:', error);
				setError('Failed to fetch historical data. Please try again.');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [from, to, days]);

	// Format epoch timestamp into locale format
	const formatDate = (timestamp: number) =>
		new Date(timestamp).toLocaleDateString();

	return (
		<Card className='mt-8'>
			<CardHeader>
				<CardTitle>Currency History</CardTitle>
				<CardDescription>
					View historical currency data over time
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='flex flex-col gap-4 md:flex-row'>
					<div className='flex-1'>
						<Label htmlFor='from'>From</Label>
						<Select
							value={from}
							onValueChange={(val) => setFrom(val)}
						>
							<SelectTrigger className='w-full'>
								{from.toUpperCase()}
							</SelectTrigger>
							<SelectContent>
								{Object.entries(currencies).map(
									([code, name]) => (
										<SelectItem key={code} value={code}>
											{code.toUpperCase()} - {name}
										</SelectItem>
									)
								)}
							</SelectContent>
						</Select>
					</div>
					<div className='flex-1'>
						<Label htmlFor='to'>To</Label>
						<Select value={to} onValueChange={(val) => setTo(val)}>
							<SelectTrigger className='w-full'>
								{to.toUpperCase()}
							</SelectTrigger>
							<SelectContent>
								{Object.entries(currencies).map(
									([code, name]) => (
										<SelectItem key={code} value={code}>
											{code.toUpperCase()} - {name}
										</SelectItem>
									)
								)}
							</SelectContent>
						</Select>
					</div>
					<div className='flex-1'>
						<Label htmlFor='days'>Days</Label>
						<Input
							id='days'
							type='number'
							value={days}
							onChange={(e) => setDays(Number(e.target.value))}
							min='1'
							max='365'
						/>
					</div>
				</div>
				{loading && <div className='text-center'>Loading...</div>}
				{error && (
					<div className='text-center text-red-600'>{error}</div>
				)}
				{!loading && !error && data.length > 0 && (
					<ResponsiveContainer width='100%' height={400}>
						<LineChart
							data={data}
							margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
						>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis dataKey='t' tickFormatter={formatDate} />
							<YAxis />
							<Tooltip labelFormatter={formatDate} />
							<Legend />
							<Line
								type='monotone'
								dataKey='c'
								stroke='#8884d8'
							/>
							{/* Brush allows zoom functionality */}
							<Brush
								dataKey='t'
								height={30}
								stroke='#8884d8'
								tickFormatter={formatDate}
							/>
						</LineChart>
					</ResponsiveContainer>
				)}
			</CardContent>
			<CardFooter>
				<div className='text-sm text-muted-foreground'>
					Data for the past {days} days.
				</div>
			</CardFooter>
		</Card>
	);
};

export default CurrencyHistoryChart;
