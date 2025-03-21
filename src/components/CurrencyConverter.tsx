'use client';

import { useState, useEffect, SetStateAction } from 'react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';

interface CurrencyConverterProps {
	money: number;
}

const CurrencyConverter = ({ money }: CurrencyConverterProps) => {
	const [currencies, setCurrencies] = useState<Record<string, string>>({});
	const [from, setFrom] = useState('');
	const [to, setTo] = useState('');
	const [amount, setAmount] = useState(money.toString());
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

				console.log('SYMBOL' + data.symbols);

				setCurrencies(data.symbols);

				setFrom('USD');
				setTo('EUR');

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				setError(
					'Failed to fetch currencies. Please try again. ' +
						error.message
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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			setError(
				'Failed to convert currency. Please try again. ' + error.message
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className='mt-8'>
			<CardHeader>
				<CardTitle>Currency Converter</CardTitle>
				<CardDescription>Convert currencies easily</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div>
					<Label htmlFor='from'>From</Label>
					<Select
						value={from}
						onValueChange={(val: SetStateAction<string>) =>
							setFrom(val)
						}
					>
						<SelectTrigger className='w-full'>
							{from.toUpperCase()}
						</SelectTrigger>
						<SelectContent>
							{Object.entries(currencies).map(([code, name]) => (
								<SelectItem key={code} value={code}>
									{code.toUpperCase()} - {name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div>
					<Label htmlFor='to'>To</Label>
					<Select
						value={to}
						onValueChange={(val: SetStateAction<string>) =>
							setTo(val)
						}
					>
						<SelectTrigger className='w-full'>
							{to.toUpperCase()}
						</SelectTrigger>
						<SelectContent>
							{Object.entries(currencies).map(([code, name]) => (
								<SelectItem key={code} value={code}>
									{code.toUpperCase()} - {name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div>
					<Label htmlFor='amount'>Amount</Label>
					<Input
						id='amount'
						type='number'
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						placeholder='e.g., 100'
					/>
				</div>
				{error && <div className='text-red-600'>{error}</div>}
				{result !== null && (
					<div className='text-lg font-semibold'>
						Converted Amount: {result.toFixed(2)} {to.toUpperCase()}
					</div>
				)}
			</CardContent>
			<CardFooter>
				<Button
					onClick={handleConvert}
					disabled={loading}
					className='w-full'
				>
					{loading ? 'Converting...' : 'Convert'}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default CurrencyConverter;
