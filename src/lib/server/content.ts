import { and, asc, desc, eq, gte, ne } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { activities, articles, categories, studies, user } from '$lib/server/db/schema';

const articleSelection = {
	id: articles.id,
	title: articles.title,
	slug: articles.slug,
	excerpt: articles.excerpt,
	content: articles.content,
	coverImage: articles.coverImage,
	category: articles.category,
	status: articles.status,
	authorId: articles.authorId,
	author: user.name,
	publishedAt: articles.publishedAt,
	createdAt: articles.createdAt,
	updatedAt: articles.updatedAt
};

export async function getPublishedArticles(limit?: number) {
	const query = db
		.select(articleSelection)
		.from(articles)
		.innerJoin(user, eq(articles.authorId, user.id))
		.where(eq(articles.status, 'published'))
		.orderBy(desc(articles.publishedAt));
	return limit ? query.limit(limit) : query;
}

export async function getAllArticles() {
	return db
		.select(articleSelection)
		.from(articles)
		.innerJoin(user, eq(articles.authorId, user.id))
		.orderBy(desc(articles.updatedAt));
}

export async function getArticleBySlug(slug: string) {
	return db
		.select(articleSelection)
		.from(articles)
		.innerJoin(user, eq(articles.authorId, user.id))
		.where(and(eq(articles.slug, slug), eq(articles.status, 'published')))
		.get();
}

export async function getArticleById(id: string) {
	return db.select().from(articles).where(eq(articles.id, id)).get();
}

export async function getRelatedArticles(category: string, id: string) {
	return db
		.select(articleSelection)
		.from(articles)
		.innerJoin(user, eq(articles.authorId, user.id))
		.where(
			and(eq(articles.status, 'published'), eq(articles.category, category), ne(articles.id, id))
		)
		.orderBy(desc(articles.publishedAt))
		.limit(3);
}

export async function getArticleRecommendations(id: string, limit = 5) {
	return db
		.select(articleSelection)
		.from(articles)
		.innerJoin(user, eq(articles.authorId, user.id))
		.where(and(eq(articles.status, 'published'), ne(articles.id, id)))
		.orderBy(desc(articles.publishedAt))
		.limit(limit);
}

export async function getCategories() {
	return db.select().from(categories).orderBy(asc(categories.name));
}

export async function getActivities() {
	return db.select().from(activities).orderBy(asc(activities.startsAt));
}

export async function getUpcomingActivities(limit?: number) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const query = db
		.select()
		.from(activities)
		.where(gte(activities.startsAt, today))
		.orderBy(asc(activities.startsAt));
	return limit ? query.limit(limit) : query;
}

export async function getActivityById(id: string) {
	return db.select().from(activities).where(eq(activities.id, id)).get();
}

export async function getUpcomingStudies(limit?: number) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const query = db
		.select()
		.from(studies)
		.where(gte(studies.startsAt, today))
		.orderBy(asc(studies.startsAt));
	return limit ? query.limit(limit) : query;
}

export async function getDashboardStats() {
	const [allArticles, upcomingActivities, upcomingStudies] = await Promise.all([
		getAllArticles(),
		getUpcomingActivities(),
		getUpcomingStudies()
	]);
	return {
		articleCount: allArticles.length,
		draftCount: allArticles.filter((article) => article.status === 'draft').length,
		activityCount: upcomingActivities.length,
		studyCount: upcomingStudies.length,
		recentDrafts: allArticles.filter((article) => article.status === 'draft').slice(0, 4)
	};
}
