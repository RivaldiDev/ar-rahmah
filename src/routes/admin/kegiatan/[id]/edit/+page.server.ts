import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { activities } from '$lib/server/db/schema';
import { getActivityById } from '$lib/server/content';
import {
	FormValidationError,
	parseJakartaDateTime,
	requiredString,
	safeFormMessage
} from '$lib/server/forms';
import { saveCoverImage } from '$lib/server/uploads';

export const load: PageServerLoad = async ({ params }) => {
	const activity = await getActivityById(params.id);
	if (!activity) error(404, 'Kegiatan tidak ditemukan');
	return { activity };
};
export const actions: Actions = {
	default: async ({ request, params }) => {
		const existing = await getActivityById(params.id);
		if (!existing) error(404, 'Kegiatan tidak ditemukan');
		try {
			const form = await request.formData();
			await db
				.update(activities)
				.set({
					title: requiredString(form, 'title', 160),
					description: requiredString(form, 'description', 1200),
					startsAt: parseJakartaDateTime(requiredString(form, 'startsAt', 30)),
					location: requiredString(form, 'location', 160),
					coverImage: await saveCoverImage(form.get('cover') as File | null, existing.coverImage)
				})
				.where(eq(activities.id, params.id));
		} catch (caught) {
			if (!(caught instanceof FormValidationError)) {
				console.error('Kegiatan gagal diperbarui', { errorId: crypto.randomUUID(), error: caught });
			}
			return fail(400, {
				message: safeFormMessage(caught, 'Kegiatan gagal diperbarui.')
			});
		}
		redirect(303, '/admin/kegiatan');
	}
};
