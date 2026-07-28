import { describe, expect, it } from 'vitest';
import {
	DEFAULT_PRAYER_LOCATION,
	getPeriod,
	normalizeSchedule,
	type PrayerScheduleResponse
} from './prayer-times';

describe('prayer time domain helpers', () => {
	it('uses the current month when the requested period is invalid', () => {
		expect(getPeriod('not-a-month', new Date('2026-07-16T00:00:00+07:00'))).toBe('2026-07');
	});

	it('keeps a valid requested month', () => {
		expect(getPeriod('2026-08', new Date('2026-07-16T00:00:00+07:00'))).toBe('2026-08');
	});

	it('normalizes a provider response into chronological rows', () => {
		const response: PrayerScheduleResponse = {
			status: true,
			message: 'success',
			data: {
				id: DEFAULT_PRAYER_LOCATION.id,
				kabko: DEFAULT_PRAYER_LOCATION.name,
				prov: 'JAWA BARAT',
				jadwal: {
					'2026-07-02': {
						tanggal: 'Kamis, 02/07/2026',
						imsak: '04:31',
						subuh: '04:41',
						terbit: '05:59',
						dhuha: '06:28',
						dzuhur: '11:58',
						ashar: '15:19',
						maghrib: '17:51',
						isya: '19:05'
					},
					'2026-07-01': {
						tanggal: 'Rabu, 01/07/2026',
						imsak: '04:31',
						subuh: '04:41',
						terbit: '05:59',
						dhuha: '06:28',
						dzuhur: '11:58',
						ashar: '15:19',
						maghrib: '17:51',
						isya: '19:05'
					}
				}
			}
		};

		const result = normalizeSchedule(response);

		expect(result.location).toBe('KAB. KARAWANG');
		expect(result.rows.map((row) => row.date)).toEqual(['2026-07-01', '2026-07-02']);
	});
});
