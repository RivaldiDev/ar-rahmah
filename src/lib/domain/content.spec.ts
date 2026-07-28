import { describe, expect, it } from 'vitest';
import { estimateReadingMinutes, filterArticles, partitionActivities } from './content';

describe('content helpers', () => {
	it('estimates at least one minute for short articles', () => {
		expect(estimateReadingMinutes('<p>Nasihat singkat.</p>')).toBe(1);
	});

	it('filters published articles by title and category', () => {
		const articles = [
			{ title: 'Adab Bertetangga', category: 'Akhlak', status: 'published' },
			{ title: 'Panduan Zakat', category: 'Fikih', status: 'published' },
			{ title: 'Catatan Pengurus', category: 'Akhlak', status: 'draft' }
		];

		expect(filterArticles(articles, 'adab', 'Akhlak')).toEqual([articles[0]]);
		expect(filterArticles(articles, '', 'Semua')).toEqual([articles[0], articles[1]]);
	});

	it('partitions activities using the end of their scheduled day', () => {
		const now = new Date('2026-07-16T12:00:00+07:00');
		const activities = [
			{ id: 'today', startsAt: new Date('2026-07-16T06:00:00+07:00') },
			{ id: 'past', startsAt: new Date('2026-07-14T09:00:00+07:00') },
			{ id: 'future', startsAt: new Date('2026-07-20T09:00:00+07:00') }
		];

		const result = partitionActivities(activities, now);
		expect(result.upcoming.map((item) => item.id)).toEqual(['today', 'future']);
		expect(result.past.map((item) => item.id)).toEqual(['past']);
	});
});
