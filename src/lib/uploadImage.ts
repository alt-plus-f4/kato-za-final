import { put } from '@vercel/blob';

export async function uploadImage(
	file: Blob,
	fileName: string
): Promise<string | null> {
	if (!file) return null;

	const arrayBuffer = await file.arrayBuffer();

	if (!process.env.BLOB_READ_WRITE_TOKEN) {
		throw new Error(
			'BLOB_READ_WRITE_TOKEN not defined in environment variables.'
		);
	}

	try {
		const result = await put(`goal-images/${fileName}.png`, arrayBuffer, {
			access: 'public',
			token: process.env.BLOB_READ_WRITE_TOKEN,
			contentType: 'image/png',
		});
		console.log(`Upload successful. URL: ${result.url}`);
		return result.url;
	} catch (error) {
		console.error('Error uploading image:', error);
		return null;
	}
}
