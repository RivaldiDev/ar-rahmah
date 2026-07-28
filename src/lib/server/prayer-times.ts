import {
	DEFAULT_PRAYER_LOCATION,
	normalizeSchedule,
	type PrayerLocation,
	type PrayerSchedule,
	type PrayerScheduleResponse
} from '$lib/domain/prayer-times';

const API_BASE = 'https://api.myquran.com/v3/sholat';
const LOCATION_CACHE_MS = 24 * 60 * 60 * 1000;
const SCHEDULE_CACHE_MS = 15 * 60 * 1000;

type Fetcher = typeof fetch;
type CacheEntry<T> = { expiresAt: number; value: T };

let locationCache: CacheEntry<PrayerLocation[]> | undefined;
const scheduleCache = new Map<string, CacheEntry<PrayerSchedule>>();

async function fetchJson<T>(fetcher: Fetcher, url: string): Promise<T> {
	const response = await fetcher(url, {
		headers: { Accept: 'application/json' },
		signal: AbortSignal.timeout(12_000)
	});
	if (!response.ok) throw new Error(`Layanan jadwal salat merespons ${response.status}.`);
	return (await response.json()) as T;
}

export async function getPrayerLocations(fetcher: Fetcher = fetch) {
	if (locationCache && locationCache.expiresAt > Date.now()) return locationCache.value;

	const response = await fetchJson<{
		status: boolean;
		message: string;
		data: PrayerLocation[];
	}>(fetcher, `${API_BASE}/kabkota/semua`);
	if (!response.status || !Array.isArray(response.data)) {
		throw new Error(response.message || 'Daftar kabupaten/kota tidak tersedia.');
	}

	const value = response.data.sort((left, right) => left.lokasi.localeCompare(right.lokasi, 'id'));
	locationCache = { expiresAt: Date.now() + LOCATION_CACHE_MS, value };
	return value;
}

export async function getPrayerSchedule(
	locationId: string = DEFAULT_PRAYER_LOCATION.id,
	period: string,
	fetcher: Fetcher = fetch
) {
	const cacheKey = `${locationId}:${period}`;
	const cached = scheduleCache.get(cacheKey);
	if (cached && cached.expiresAt > Date.now()) return cached.value;

	const response = await fetchJson<PrayerScheduleResponse>(
		fetcher,
		`${API_BASE}/jadwal/${encodeURIComponent(locationId)}/${encodeURIComponent(period)}`
	);
	const value = normalizeSchedule(response);
	scheduleCache.set(cacheKey, { expiresAt: Date.now() + SCHEDULE_CACHE_MS, value });
	return value;
}
