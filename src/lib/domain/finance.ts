export const SOCIAL_FINANCE_FUND_ID = 'dana-sosial';
export const legacySocialFinanceFundIds = ['orang-sakit', 'kematian'] as const;

export const financeFundPresets = [
	{
		id: 'kas-masjid',
		name: 'Kas Masjid',
		description: 'Dana operasional dan kebutuhan umum masjid.',
		source: 'Kotak infak masjid di depan masjid',
		sortOrder: 1
	},
	{
		id: 'infak-jumat',
		name: 'Infak Jumat / Keropak',
		description: 'Infak jamaah yang dihimpun setiap salat Jumat.',
		source: 'Keropak infak salat Jumat',
		sortOrder: 2
	},
	{
		id: 'anak-yatim',
		name: 'Dana Anak Yatim',
		description: 'Amanah jamaah untuk santunan dan kebutuhan anak yatim.',
		source: 'Kotak infak anak yatim di depan masjid',
		sortOrder: 3
	},
	{
		id: SOCIAL_FINANCE_FUND_ID,
		name: 'Dana Sosial Sakit & Kematian',
		description: 'Bantuan bagi warga yang sakit serta keluarga warga yang meninggal.',
		source: 'Infak sosial dan iuran keliling warga',
		sortOrder: 4
	}
] as const;

export function normalizeFinanceFundId(fundId: string) {
	return (legacySocialFinanceFundIds as readonly string[]).includes(fundId)
		? SOCIAL_FINANCE_FUND_ID
		: fundId;
}

export type FinanceTransactionType = 'income' | 'expense';

export const financeTransactionTypes: ReadonlyArray<{
	value: FinanceTransactionType;
	label: string;
}> = [
	{ value: 'income', label: 'Pemasukan' },
	{ value: 'expense', label: 'Pengeluaran' }
];

export function formatRupiah(amount: number) {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 0
	}).format(amount);
}

export function formatFinanceDate(date: Date) {
	return new Intl.DateTimeFormat('id-ID', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		timeZone: 'Asia/Jakarta'
	}).format(date);
}

export function toFinanceDateInput(date: Date) {
	return new Intl.DateTimeFormat('en-CA', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		timeZone: 'Asia/Jakarta'
	}).format(date);
}
