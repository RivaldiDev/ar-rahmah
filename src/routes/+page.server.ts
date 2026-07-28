import type { PageServerLoad } from './$types';
import {
	getPublishedArticles,
	getUpcomingActivities,
	getUpcomingStudies
} from '$lib/server/content';
import { getPeriod } from '$lib/domain/prayer-times';
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
	const [activities, studies, articles, todayPrayer] = await Promise.all([
		getUpcomingActivities(2),
		getUpcomingStudies(3),
		getPublishedArticles(4),
		prayerPromise
	]);
	return { activities, studies, articles, todayPrayer };
};
