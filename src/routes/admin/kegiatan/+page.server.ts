import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { activities } from '$lib/server/db/schema';
import { getActivities } from '$lib/server/content';

export const load: PageServerLoad = async () => ({ activities: await getActivities() });
export const actions: Actions = {
	delete: async ({ request }) => {
		const id = (await request.formData()).get('id')?.toString() ?? '';
		if (!id) return fail(400, { message: 'Kegiatan tidak valid.' });
		await db.delete(activities).where(eq(activities.id, id));
		return { success: true };
	}
};
