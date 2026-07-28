import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { articles } from '$lib/server/db/schema';
import { getArticleById, getCategories } from '$lib/server/content';
import {
	FormValidationError,
	hasMeaningfulArticleContent,
	requiredString,
	safeFormMessage,
	sanitizeArticleContent,
	validateCategory
} from '$lib/server/forms';
import { saveCoverImage } from '$lib/server/uploads';
import { isArticleCoverTemplate } from '$lib/domain/article-templates';

export const load: PageServerLoad = async ({ params }) => {
	const [article, categories] = await Promise.all([getArticleById(params.id), getCategories()]);
	if (!article) error(404, 'Artikel tidak ditemukan');
	return { article: { ...article, content: sanitizeArticleContent(article.content) }, categories };
};
export const actions: Actions = {
	default: async ({ request, params }) => {
		const existing = await getArticleById(params.id);
		if (!existing) error(404, 'Artikel tidak ditemukan');
		try {
			const form = await request.formData();
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
			const allowedCategories = (await getCategories()).map((category) => category.name);
			await db
				.update(articles)
				.set({
					title: requiredString(form, 'title', 160),
					excerpt: requiredString(form, 'excerpt', 320),
					category: validateCategory(requiredString(form, 'category', 50), allowedCategories),
					status,
					content,
					coverImage: await saveCoverImage(
						form.get('cover') as File | null,
						(typeof coverTemplate === 'string' && coverTemplate) || existing.coverImage
					),
					publishedAt: status === 'published' ? (existing.publishedAt ?? new Date()) : null
				})
				.where(eq(articles.id, params.id));
		} catch (caught) {
			if (!(caught instanceof FormValidationError)) {
				console.error('Artikel gagal diperbarui', { errorId: crypto.randomUUID(), error: caught });
			}
			return fail(400, {
				message: safeFormMessage(caught, 'Artikel gagal diperbarui.')
			});
		}
		redirect(303, '/admin/artikel');
	}
};
