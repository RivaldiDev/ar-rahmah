import type { PageServerLoad } from './$types';
import { getCategories, getPublishedArticles } from '$lib/server/content';

export const load: PageServerLoad = async ({ url }) => {
	const [articles, categories] = await Promise.all([getPublishedArticles(), getCategories()]);
	const requestedCategory = url.searchParams.get('category');
	const initialCategory = categories.some((category) => category.name === requestedCategory)
		? requestedCategory!
		: 'Semua';
	return { articles, categories, initialCategory };
};
