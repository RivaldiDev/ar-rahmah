export const DEFAULT_PRAYER_LOCATION = {
	id: '1ff8a7b5dc7a7d1f0ed65aaa29c04b1e',
	name: 'KAB. KARAWANG'
} as const;

export type PrayerLocation = {
	id: string;
	lokasi: string;
};

export type PrayerScheduleRow = {
	date: string;
	label: string;
	imsak: string;
	subuh: string;
	terbit: string;
	dhuha: string;
	dzuhur: string;
	ashar: string;
	maghrib: string;
	isya: string;
};

type ProviderSchedule = Omit<PrayerScheduleRow, 'date' | 'label'> & {
	tanggal: string;
};

export type PrayerScheduleResponse = {
	status: boolean;
	message: string;
	data: {
		id: string;
		kabko: string;
		prov: string;
		jadwal: Record<string, ProviderSchedule>;
	};
};

export type PrayerSchedule = {
	locationId: string;
	location: string;
	province: string;
	rows: PrayerScheduleRow[];
};

export function getPeriod(value: string | null | undefined, now = new Date()) {
	if (value && /^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return value;

	const parts = new Intl.DateTimeFormat('en', {
		timeZone: 'Asia/Jakarta',
		year: 'numeric',
		month: '2-digit'
	}).formatToParts(now);
	const year = parts.find((part) => part.type === 'year')?.value ?? String(now.getFullYear());
	const month =
		parts.find((part) => part.type === 'month')?.value ??
		String(now.getMonth() + 1).padStart(2, '0');
	return `${year}-${month}`;
}

export function normalizeSchedule(response: PrayerScheduleResponse): PrayerSchedule {
	if (!response.status || !response.data?.jadwal) {
		throw new Error(response.message || 'Jadwal salat tidak tersedia.');
	}

	return {
		locationId: response.data.id,
		location: response.data.kabko,
		province: response.data.prov,
		rows: Object.entries(response.data.jadwal)
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([date, schedule]) => ({
				date,
				label: schedule.tanggal,
				imsak: schedule.imsak,
				subuh: schedule.subuh,
				terbit: schedule.terbit,
				dhuha: schedule.dhuha,
				dzuhur: schedule.dzuhur,
				ashar: schedule.ashar,
				maghrib: schedule.maghrib,
				isya: schedule.isya
			}))
	};
}

export function shiftPeriod(period: string, amount: number) {
	const [year, month] = period.split('-').map(Number);
	const date = new Date(Date.UTC(year, month - 1 + amount, 1));
	return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function formatPeriod(period: string) {
	const [year, month] = period.split('-').map(Number);
	return new Intl.DateTimeFormat('id-ID', {
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	}).format(new Date(Date.UTC(year, month - 1, 1)));
}
