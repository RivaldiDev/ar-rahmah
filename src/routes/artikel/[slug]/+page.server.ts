import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	getArticleBySlug,
	getArticleRecommendations,
	getCategories,
	getRelatedArticles
} from '$lib/server/content';
import { parseRichText } from '$lib/server/rich-text';
import { clampArticlePage, paginateArticleNodes } from '$lib/domain/article-pagination';

export const load: PageServerLoad = async ({ params, url }) => {
	const article = await getArticleBySlug(params.slug);
	if (!article) error(404, 'Artikel tidak ditemukan');
	const contentPages = paginateArticleNodes(parseRichText(article.content));
	const currentPage = clampArticlePage(url.searchParams.get('page'), contentPages.length);
	const [related, recommendations, categories] = await Promise.all([
		getRelatedArticles(article.category, article.id),
		getArticleRecommendations(article.id),
		getCategories()
	]);
	return {
		article,
		contentNodes: contentPages[currentPage - 1],
		currentPage,
		totalPages: contentPages.length,
		related,
		recommendations,
		categories
	};
};
