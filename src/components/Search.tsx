'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SearchResult {
	title: string;
	snippet: string;
	link: string;
}

interface ProductDetails {
	productName: string;
	price: string;
	description: string;
	image: string | null;
}

const Search = () => {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<SearchResult[]>([]);
	const [selectedResult, setSelectedResult] = useState<SearchResult | null>(
		null
	);
	const [productDetails, setProductDetails] = useState<ProductDetails | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(false);

	const handleSearch = async () => {
		if (!query) return;

		setResults([]);
		setSelectedResult(null);
		setProductDetails(null);

		try {
			const res = await fetch(`/api/googleSearch?query=${query}`);
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || 'Something went wrong');
			}

			if (!Array.isArray(data) || data.length === 0) {
				console.warn('No results found or unexpected format:', data);
				setResults([]);
				return;
			}

			setResults(data);
		} catch (error) {
			console.error('Search failed:', error);
			setResults([]);
		}
	};

	const handleSelect = async (result: SearchResult) => {
		setSelectedResult(result);
		setIsLoading(true);

		try {
			const res = await fetch(
				`/api/scrape?url=${encodeURIComponent(result.link)}`
			);

			if (!res.ok) {
				throw new Error(
					`Failed to fetch product details: ${res.statusText}`
				);
			}

			const data = await res.json();
			setProductDetails(data);
		} catch (error) {
			console.error('Failed to scrape product details:', error);
			setProductDetails(null);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen'>
			<div className='flex gap-4 mb-8'>
				<input
					type='text'
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder='Search...'
					className='flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
				/>
				<button
					onClick={handleSearch}
					className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
				>
					Search
				</button>
			</div>

			{selectedResult ? (
				<div className='bg-white p-6 rounded-lg shadow-md'>
					{isLoading ? (
						<p className='text-center text-gray-500'>
							Loading product details...
						</p>
					) : productDetails ? (
						<>
							<h3 className='text-2xl font-bold mb-4'>
								{productDetails.productName}
							</h3>
							{productDetails.image ? (
								<Image
									src={productDetails.image}
									alt={productDetails.productName}
									className='w-full h-64 object-cover mb-4 rounded-lg'
									width={500}
									height={300}
								/>
							) : (
								<div className='w-full h-64 bg-gray-200 flex items-center justify-center mb-4 rounded-lg'>
									<span className='text-gray-500'>
										No image available
									</span>
								</div>
							)}
							<p className='text-gray-700 mb-4'>
								<strong>Price:</strong> {productDetails.price}
							</p>
							<p className='text-gray-700 mb-4'>
								<strong>Description:</strong>{' '}
								{productDetails.description}
							</p>
							<a
								href={selectedResult.link}
								target='_blank'
								rel='noopener noreferrer'
								className='text-blue-600 hover:underline'
							>
								Visit Website
							</a>
							<button
								onClick={() => setSelectedResult(null)}
								className='mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500'
							>
								Back to Results
							</button>
						</>
					) : (
						<p className='text-center text-gray-500'>
							Failed to load product details.
						</p>
					)}
				</div>
			) : (
				<ul className='space-y-4'>
					{results.length > 0 ? (
						results.map((result, index) => (
							<li
								key={index}
								onClick={() => handleSelect(result)}
								className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer'
							>
								<h4 className='text-xl font-semibold mb-2'>
									{result.title}
								</h4>
								<p className='text-gray-600'>
									{result.snippet}
								</p>
							</li>
						))
					) : (
						<p className='text-center text-gray-500'>
							No results found.
						</p>
					)}
				</ul>
			)}
		</div>
	);
};

export default Search;
