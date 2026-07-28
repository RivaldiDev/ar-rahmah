import type { PageServerLoad } from './$types';
import { getActivities, getPublishedArticles, getUpcomingStudies } from '$lib/server/content';
import { getPeriod } from '$lib/domain/prayer-times';
import { selectHomepageActivities } from '$lib/domain/content';
import { getPrayerSchedule } from '$lib/server/prayer-times';

export const load: PageServerLoad = async ({ fetch }) => {
	const today = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Asia/Jakarta',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(new Date());
	const prayerPromise = getPrayerSchedule(undefined, getPeriod(undefined), fetch)
		.then((schedule) => schedule.rows.find((row) => row.date === today) ?? null)
		.catch(() => null);
	const [allActivities, studies, articles, todayPrayer] = await Promise.all([
		getActivities(),
		getUpcomingStudies(3),
		getPublishedArticles(4),
		prayerPromise
	]);
	return {
		activities: selectHomepageActivities(allActivities),
		studies,
		articles,
		todayPrayer
	};
};
