import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { getAllArticles } from '$lib/server/content';
import { db } from '$lib/server/db';
import { articles } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => ({ articles: await getAllArticles() });
export const actions: Actions = {
	delete: async ({ request }) => {
		const id = (await request.formData()).get('id')?.toString() ?? '';
		if (!id) return fail(400, { message: 'Artikel tidak valid.' });
		await db.delete(articles).where(eq(articles.id, id));
		return { success: true };
	}
};
