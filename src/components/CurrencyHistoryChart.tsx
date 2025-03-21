'use client';

import { useState, useEffect } from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from 'recharts';

const CurrencyHistoryChart = () => {
	const [from, setFrom] = useState('USD');
	const [to, setTo] = useState('EUR');
	const [days, setDays] = useState(30);
	const [currencies, setCurrencies] = useState<Record<string, string>>({});
	const [data, setData] = useState<{ t: number; c: number }[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

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
			} catch (error) {
				console.error('Failed to fetch currencies:', error);
				setError('Failed to fetch currencies. Please try again.');
			}
		};

		fetchCurrencies();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			if (!from || !to) return;

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
			} catch (error) {
				console.error('Failed to fetch historical data:', error);
				setError('Failed to fetch historical data. Please try again.');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [from, to, days]);

	return (
		<div className='p-6 bg-gray-100 rounded-lg'>
			<h1 className='text-2xl font-bold mb-4'>Currency History</h1>
			<div className='space-y-4'>
				<div className='flex gap-4'>
					<div className='flex-1'>
						<label className='block text-sm font-medium mb-1'>
							From
						</label>
						<select
							value={from}
							onChange={(e) => setFrom(e.target.value)}
							className='w-full p-2 border rounded-lg'
						>
							<option value='' disabled>
								Select currency
							</option>
							{Object.entries(currencies).map(([code, name]) => (
								<option key={code} value={code}>
									{code} - {name}
								</option>
							))}
						</select>
					</div>
					<div className='flex-1'>
						<label className='block text-sm font-medium mb-1'>
							To
						</label>
						<select
							value={to}
							onChange={(e) => setTo(e.target.value)}
							className='w-full p-2 border rounded-lg'
						>
							<option value='' disabled>
								Select currency
							</option>
							{Object.entries(currencies).map(([code, name]) => (
								<option key={code} value={code}>
									{code} - {name}
								</option>
							))}
						</select>
					</div>
					<div className='flex-1'>
						<label className='block text-sm font-medium mb-1'>
							Days
						</label>
						<input
							type='number'
							value={days}
							onChange={(e) => setDays(Number(e.target.value))}
							className='w-full p-2 border rounded-lg'
							min='1'
							max='365'
						/>
					</div>
				</div>

				{loading && <div className='text-center'>Loading...</div>}

				{error && (
					<div className='text-red-600 text-center'>{error}</div>
				)}

				{!loading && !error && data.length > 0 && (
					<LineChart
						width={800}
						height={400}
						data={data}
						margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
					>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis
							dataKey='t'
							tickFormatter={(timestamp) =>
								new Date(timestamp).toLocaleDateString()
							}
						/>
						<YAxis />
						<Tooltip />
						<Legend />
						<Line type='monotone' dataKey='c' stroke='#8884d8' />
					</LineChart>
				)}
			</div>
		</div>
	);
};

export default CurrencyHistoryChart;
