export const articleCoverTemplates = [
	{
		id: 'fikih',
		label: 'Fikih',
		description: 'Al-Qur’an, rehal, dan tasbih',
		path: '/images/article-templates/fikih.webp'
	},
	{
		id: 'akhlak',
		label: 'Akhlak',
		description: 'Berbagi dan menjaga tetangga',
		path: '/images/article-templates/akhlak.webp'
	},
	{
		id: 'aqidah',
		label: 'Aqidah',
		description: 'Masjid dalam cahaya fajar',
		path: '/images/article-templates/aqidah.webp'
	},
	{
		id: 'muamalah',
		label: 'Muamalah',
		description: 'Transaksi yang amanah',
		path: '/images/article-templates/muamalah.webp'
	},
	{
		id: 'sirah',
		label: 'Sirah',
		description: 'Peta, manuskrip, dan lentera',
		path: '/images/article-templates/sirah.webp'
	},
	{
		id: 'tafsir',
		label: 'Tafsir',
		description: 'Kajian Al-Qur’an dan catatan',
		path: '/images/article-templates/tafsir.webp'
	},
	{
		id: 'kurban',
		label: 'Kurban',
		description: 'Hewan kurban dan kebersamaan',
		path: '/images/article-templates/kurban.webp'
	},
	{
		id: 'puasa-ramadan',
		label: 'Puasa & Ramadan',
		description: 'Hidangan berbuka dan lentera',
		path: '/images/article-templates/puasa-ramadan.webp'
	},
	{
		id: 'hari-besar-islam',
		label: 'Hari Besar Islam',
		description: 'Perayaan hangat di masjid',
		path: '/images/article-templates/hari-besar-islam.webp'
	},
	{
		id: 'sosial-yatim',
		label: 'Sosial & Yatim',
		description: 'Santunan dan perlengkapan sekolah',
		path: '/images/article-templates/yatim-sosial.webp'
	}
] as const;

export const defaultArticleCover = articleCoverTemplates[0].path;

export function isArticleCoverTemplate(value: string) {
	return articleCoverTemplates.some((template) => template.path === value);
}
