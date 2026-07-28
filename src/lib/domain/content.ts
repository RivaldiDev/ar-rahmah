export type ArticleStatus = 'draft' | 'published';

type FilterableArticle = {
	title: string;
	category: string;
	status: string;
};

type ScheduledItem = {
	startsAt: Date;
};

export function estimateReadingMinutes(html: string) {
	const words = html
		.replace(/<[^>]*>/g, ' ')
		.trim()
		.split(/\s+/)
		.filter(Boolean).length;
	return Math.max(1, Math.ceil(words / 200));
}

export function filterArticles<T extends FilterableArticle>(
	articles: T[],
	query: string,
	category: string
) {
	const normalizedQuery = query.trim().toLocaleLowerCase('id-ID');
	return articles.filter((article) => {
		const matchesQuery = article.title.toLocaleLowerCase('id-ID').includes(normalizedQuery);
		const matchesCategory = category === 'Semua' || article.category === category;
		return article.status === 'published' && matchesQuery && matchesCategory;
	});
}

export function partitionActivities<T extends ScheduledItem>(items: T[], now = new Date()) {
	const today = new Date(now);
	today.setHours(0, 0, 0, 0);
	return {
		upcoming: items.filter((item) => item.startsAt >= today),
		past: items.filter((item) => item.startsAt < today)
	};
}

export function slugify(value: string) {
	return value
		.toLocaleLowerCase('id-ID')
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

export function formatDate(value: Date | string, options: Intl.DateTimeFormatOptions = {}) {
	return new Intl.DateTimeFormat('id-ID', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'Asia/Jakarta',
		...options
	}).format(new Date(value));
}

export function formatTime(value: Date | string) {
	return new Intl.DateTimeFormat('id-ID', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
		timeZone: 'Asia/Jakarta'
	}).format(new Date(value));
}

export function toDateTimeLocal(value: Date | string) {
	const date = new Date(value);
	const jakarta = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
	const pad = (part: number) => `${part}`.padStart(2, '0');
	return `${jakarta.getFullYear()}-${pad(jakarta.getMonth() + 1)}-${pad(jakarta.getDate())}T${pad(jakarta.getHours())}:${pad(jakarta.getMinutes())}`;
}
