import { DEFAULT_PRAYER_LOCATION, getPeriod } from '$lib/domain/prayer-times';
import { getPrayerLocations, getPrayerSchedule } from '$lib/server/prayer-times';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const period = getPeriod(url.searchParams.get('period'));
	const requestedLocation = url.searchParams.get('location') ?? DEFAULT_PRAYER_LOCATION.id;

	try {
		const locations = await getPrayerLocations(fetch);
		const locationId = locations.some((location) => location.id === requestedLocation)
			? requestedLocation
			: DEFAULT_PRAYER_LOCATION.id;
		const schedule = await getPrayerSchedule(locationId, period, fetch);

		return {
			locations,
			period,
			schedule,
			today: new Intl.DateTimeFormat('en-CA', {
				timeZone: 'Asia/Jakarta',
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			}).format(new Date()),
			errorMessage: null
		};
	} catch (error) {
		return {
			locations: [{ id: DEFAULT_PRAYER_LOCATION.id, lokasi: DEFAULT_PRAYER_LOCATION.name }],
			period,
			schedule: null,
			today: '',
			errorMessage:
				error instanceof Error
					? error.message
					: 'Jadwal belum dapat dimuat. Silakan coba beberapa saat lagi.'
		};
	}
};
