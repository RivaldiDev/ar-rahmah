import { describe, expect, it } from 'vitest';
import { financeFundPresets, normalizeFinanceFundId, SOCIAL_FINANCE_FUND_ID } from './finance';

describe('finance funds', () => {
	it('combines sick assistance and death assistance into one social fund', () => {
		expect(financeFundPresets.map((fund) => fund.id)).toEqual([
			'kas-masjid',
			'infak-jumat',
			'anak-yatim',
			SOCIAL_FINANCE_FUND_ID
		]);
		expect(financeFundPresets.at(-1)).toMatchObject({
			name: 'Dana Sosial Sakit & Kematian',
			source: 'Infak sosial dan iuran keliling warga'
		});
	});

	it('maps both legacy fund links to the combined social fund', () => {
		expect(normalizeFinanceFundId('orang-sakit')).toBe(SOCIAL_FINANCE_FUND_ID);
		expect(normalizeFinanceFundId('kematian')).toBe(SOCIAL_FINANCE_FUND_ID);
		expect(normalizeFinanceFundId(SOCIAL_FINANCE_FUND_ID)).toBe(SOCIAL_FINANCE_FUND_ID);
		expect(normalizeFinanceFundId('kas-masjid')).toBe('kas-masjid');
	});
});
