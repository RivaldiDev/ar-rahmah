import { error, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { media } from '$lib/server/db/schema';

export const GET: RequestHandler = async ({ params }) => {
	if (
		!params.id ||
		!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(params.id)
	) {
		error(404, 'Gambar tidak ditemukan');
	}
	const image = db.select().from(media).where(eq(media.id, params.id)).get();
	if (!image) error(404, 'Gambar tidak ditemukan');
	return new Response(new Uint8Array(image.data), {
		headers: {
			'Content-Type': image.mimeType,
			'Cache-Control': 'public, max-age=31536000, immutable',
			'Content-Disposition': `inline; filename="${encodeURIComponent(image.filename)}"`
		}
	});
};
