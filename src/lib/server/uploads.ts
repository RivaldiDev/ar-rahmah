import { db } from '$lib/server/db';
import { media } from '$lib/server/db/schema';
import { normalizeCoverImage } from '$lib/server/image-processing';

export async function saveCoverImage(file: File | null, fallback: string) {
	if (!file || file.size === 0) return fallback;
	const normalized = await normalizeCoverImage(file);

	const id = crypto.randomUUID();
	await db.insert(media).values({
		id,
		filename: normalized.filename,
		mimeType: normalized.mimeType,
		data: normalized.data
	});
	return `/media/${id}`;
}
