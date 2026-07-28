import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { activities } from '$lib/server/db/schema';
import {
	FormValidationError,
	parseJakartaDateTime,
	requiredString,
	safeFormMessage
} from '$lib/server/forms';
import { saveCoverImage } from '$lib/server/uploads';

export const actions: Actions = {
	default: async ({ request }) => {
		try {
			const form = await request.formData();
			await db.insert(activities).values({
				id: crypto.randomUUID(),
				title: requiredString(form, 'title', 160),
				description: requiredString(form, 'description', 1200),
				startsAt: parseJakartaDateTime(requiredString(form, 'startsAt', 30)),
				location: requiredString(form, 'location', 160),
				coverImage: await saveCoverImage(
					form.get('cover') as File | null,
					'/images/masjid-ar-rahmah-hero.webp'
				)
			});
		} catch (error) {
			if (!(error instanceof FormValidationError)) {
				console.error('Kegiatan gagal disimpan', { errorId: crypto.randomUUID(), error });
			}
			return fail(400, {
				message: safeFormMessage(error, 'Kegiatan gagal disimpan.')
			});
		}
		redirect(303, '/admin/kegiatan');
	}
};
