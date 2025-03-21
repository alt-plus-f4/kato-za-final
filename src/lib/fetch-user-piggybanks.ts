export default async function fetchUserPiggybanks(userId: string) {
	try {
		const response = await fetch(
			`${process.env.NEXTAUTH_URL}/api/piggybank/user?userId=${userId}`,
			{
				cache: 'no-store',
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'GET',
			}
		);

		if (!response.ok) {
			throw new Error(`API error: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching user data from API:', error);
		return {
			piggyBank: {
				id: 999,
				money: 650,
				goalId: 999,
			},
			goal: {
				id: 999,
				userId: 999,
				name: 'Dream Vacation',
				description: 'Trip to Bali in summer 2024',
				price: 1000,
				picture: null,
			},
		};
	}
}
