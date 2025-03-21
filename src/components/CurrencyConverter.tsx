'use client';

import { useState, useEffect } from 'react';

const CurrencyConverter = () => {
	const [currencies, setCurrencies] = useState<Record<string, string>>({});
	const [from, setFrom] = useState('');
	const [to, setTo] = useState('');
	const [amount, setAmount] = useState('');
	const [result, setResult] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCurrencies = async () => {
			try {
				const response = await fetch('/api/fetchCurrencies');
				const data = await response.json();
				if (!response.ok)
					throw new Error(data.error || 'Failed to fetch currencies');
				setCurrencies(data.symbols);
				setFrom(Object.keys(data.symbols)[0] || 'EUR');
				setTo(Object.keys(data.symbols)[1] || 'USD');
			} catch (error) {
				setError(
					'Failed to fetch currencies. Please try again.' + error
				);
			}
		};
		fetchCurrencies();
	}, []);

	const handleConvert = async () => {
		if (!from || !to || !amount) {
			setError('Please select currencies and enter an amount');
			return;
		}

		setLoading(true);
		setError(null);
		try {
			const response = await fetch(
				`/api/currencyConverter?from=${from}&to=${to}&amount=${amount}`
			);
			const data = await response.json();
			if (!response.ok)
				throw new Error(data.error || 'Failed to convert currency');
			setResult(data.convertedAmount);
		} catch (error) {
			setError('Failed to convert currency. Please try again.' + error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='p-6 bg-gray-100 rounded-lg'>
			<h1 className='text-2xl font-bold mb-4'>Currency Converter</h1>
			<div className='space-y-4'>
				<div>
					<label className='block text-sm font-medium mb-1'>
						From
					</label>
					<select
						value={from}
						onChange={(e) => setFrom(e.target.value)}
						className='w-full p-2 border rounded-lg'
					>
						{Object.entries(currencies).map(([code, name]) => (
							<option key={code} value={code}>
								{code.toUpperCase()} - {name}
							</option>
						))}
					</select>
				</div>
				<div>
					<label className='block text-sm font-medium mb-1'>To</label>
					<select
						value={to}
						onChange={(e) => setTo(e.target.value)}
						className='w-full p-2 border rounded-lg'
					>
						{Object.entries(currencies).map(([code, name]) => (
							<option key={code} value={code}>
								{code.toUpperCase()} - {name}
							</option>
						))}
					</select>
				</div>
				<div>
					<label className='block text-sm font-medium mb-1'>
						Amount
					</label>
					<input
						type='number'
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className='w-full p-2 border rounded-lg'
						placeholder='e.g., 100'
					/>
				</div>
				<button
					onClick={handleConvert}
					disabled={loading}
					className='w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
				>
					{loading ? 'Converting...' : 'Convert'}
				</button>
				{error && <div className='mt-4 text-red-600'>{error}</div>}
				{result !== null && (
					<div className='mt-4 text-lg font-semibold'>
						Converted Amount: {result.toFixed(2)} {to.toUpperCase()}
					</div>
				)}
			</div>
		</div>
	);
};

export default CurrencyConverter;
