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
		return {};
	}
}
