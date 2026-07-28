import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { articles } from '$lib/server/db/schema';
import { getCategories } from '$lib/server/content';
import {
	FormValidationError,
	hasMeaningfulArticleContent,
	requiredString,
	safeFormMessage,
	sanitizeArticleContent,
	validateCategory
} from '$lib/server/forms';
import { saveCoverImage } from '$lib/server/uploads';
import { slugify } from '$lib/domain/content';
import { defaultArticleCover, isArticleCoverTemplate } from '$lib/domain/article-templates';

export const load: PageServerLoad = async () => ({ categories: await getCategories() });
export const actions: Actions = {
	default: async ({ request, locals }) => {
		try {
			const form = await request.formData();
			const title = requiredString(form, 'title', 160);
			const excerpt = requiredString(form, 'excerpt', 320);
			const allowedCategories = (await getCategories()).map((category) => category.name);
			const category = validateCategory(requiredString(form, 'category', 50), allowedCategories);
			const status = form.get('status') === 'published' ? 'published' : 'draft';
			const coverTemplate = form.get('coverTemplate');
			if (
				coverTemplate !== null &&
				(typeof coverTemplate !== 'string' || !isArticleCoverTemplate(coverTemplate))
			) {
				throw new FormValidationError('Template sampul tidak valid.');
			}
			const content = sanitizeArticleContent(requiredString(form, 'content', 100000));
			if (!hasMeaningfulArticleContent(content)) {
				throw new FormValidationError('Isi artikel belum ditulis.');
			}
			const id = crypto.randomUUID();
			await db.insert(articles).values({
				id,
				title,
				slug: `${slugify(title)}-${id.slice(0, 6)}`,
				excerpt,
				category,
				status,
				content,
				coverImage: await saveCoverImage(
					form.get('cover') as File | null,
					(typeof coverTemplate === 'string' && coverTemplate) || defaultArticleCover
				),
				authorId: locals.user!.id,
				publishedAt: status === 'published' ? new Date() : null
			});
		} catch (error) {
			if (!(error instanceof FormValidationError)) {
				console.error('Artikel gagal disimpan', { errorId: crypto.randomUUID(), error });
			}
			return fail(400, {
				message: safeFormMessage(error, 'Artikel gagal disimpan.')
			});
		}
		redirect(303, '/admin/artikel');
	}
};
