import Database from 'better-sqlite3';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { username as usernamePlugin } from 'better-auth/plugins';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq, inArray } from 'drizzle-orm';
import * as schema from '../src/lib/server/db/schema';
import { validateSecurityConfig } from '../src/lib/server/security-config';
import {
	financeFundPresets,
	legacySocialFinanceFundIds,
	SOCIAL_FINANCE_FUND_ID
} from '../src/lib/domain/finance';

const databaseUrl = process.env.DATABASE_URL;
const email = process.env.ADMIN_EMAIL;
const username = process.env.ADMIN_USERNAME ?? 'admin';
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME ?? 'Pengurus Ar-Rahmah';
if (!databaseUrl || !email || !password || !process.env.BETTER_AUTH_SECRET) {
	throw new Error('DATABASE_URL, BETTER_AUTH_SECRET, ADMIN_EMAIL, dan ADMIN_PASSWORD wajib diisi.');
}
if (password.length < 16 || password.length > 128) {
	throw new Error('ADMIN_PASSWORD harus berisi 16 sampai 128 karakter.');
}
if (/replace-with|password|admin123/i.test(password)) {
	throw new Error('ADMIN_PASSWORD masih berupa kata sandi contoh atau mudah ditebak.');
}
if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
	throw new Error('ADMIN_EMAIL tidak valid.');
}
if (username.length < 3 || username.length > 30 || !/^[a-zA-Z0-9_.]+$/.test(username)) {
	throw new Error(
		'ADMIN_USERNAME harus 3-30 karakter dan hanya berisi huruf, angka, titik, atau garis bawah.'
	);
}
const security = validateSecurityConfig({
	origin: process.env.ORIGIN,
	secret: process.env.BETTER_AUTH_SECRET,
	production: process.env.NODE_ENV === 'production'
});

const sqlite = new Database(databaseUrl);
const db = drizzle(sqlite, { schema });
const seedAuth = betterAuth({
	secret: process.env.BETTER_AUTH_SECRET,
	baseURL: security.origin,
	database: drizzleAdapter(db, { provider: 'sqlite' }),
	emailAndPassword: { enabled: true },
	plugins: [usernamePlugin()]
});

let admin = db.select().from(schema.user).where(eq(schema.user.email, email)).get();
if (!admin) {
	await seedAuth.api.signUpEmail({
		body: {
			name,
			email,
			password,
			username,
			displayUsername: username
		}
	});
	admin = db.select().from(schema.user).where(eq(schema.user.email, email)).get();
}
if (!admin) throw new Error('Akun admin gagal dibuat.');
await db
	.update(schema.user)
	.set({
		username: username.toLowerCase(),
		displayUsername: username
	})
	.where(eq(schema.user.id, admin.id));

const daysFromNow = (days: number, hour: number, minute = 0) => {
	const date = new Date();
	date.setDate(date.getDate() + days);
	date.setHours(hour, minute, 0, 0);
	return date;
};
const covers = {
	articleAdab: '/images/article-neighbors.webp',
	articleSalat: '/images/article-congregational-prayer.webp',
	articleSirah: '/images/article-mosque-sirah.webp',
	articleMuharram: '/images/article-muharram.webp',
	activityCleanup: '/images/activity-cleanup.webp',
	activityCharity: '/images/activity-charity.webp',
	activityYouth: '/images/activity-youth.webp',
	activityBazaar: '/images/activity-bazaar.webp'
} as const;

await db
	.insert(schema.categories)
	.values([
		{ id: 'fikih', name: 'Fikih', slug: 'fikih' },
		{ id: 'akhlak', name: 'Akhlak', slug: 'akhlak' },
		{ id: 'aqidah', name: 'Aqidah', slug: 'aqidah' },
		{ id: 'muamalah', name: 'Muamalah', slug: 'muamalah' },
		{ id: 'sirah', name: 'Sirah', slug: 'sirah' },
		{ id: 'tafsir', name: 'Tafsir', slug: 'tafsir' },
		{ id: 'kurban', name: 'Kurban', slug: 'kurban' },
		{ id: 'puasa-ramadan', name: 'Puasa & Ramadan', slug: 'puasa-ramadan' },
		{ id: 'hari-besar-islam', name: 'Hari Besar Islam', slug: 'hari-besar-islam' },
		{ id: 'sosial-yatim', name: 'Sosial & Yatim', slug: 'sosial-yatim' }
	])
	.onConflictDoNothing();

for (const fund of financeFundPresets) {
	await db
		.insert(schema.financeFunds)
		.values(fund)
		.onConflictDoUpdate({
			target: schema.financeFunds.id,
			set: {
				name: fund.name,
				description: fund.description,
				source: fund.source,
				sortOrder: fund.sortOrder
			}
		});
}
await db
	.update(schema.financeTransactions)
	.set({ fundId: SOCIAL_FINANCE_FUND_ID })
	.where(inArray(schema.financeTransactions.fundId, [...legacySocialFinanceFundIds]));
await db
	.delete(schema.financeFunds)
	.where(inArray(schema.financeFunds.id, [...legacySocialFinanceFundIds]));

await db
	.insert(schema.articles)
	.values([
		{
			id: 'article-adab',
			title: 'Adab Bertetangga yang Menumbuhkan Rahmah',
			slug: 'adab-bertetangga-yang-menumbuhkan-rahmah',
			excerpt:
				'Islam menempatkan tetangga begitu dekat dengan iman. Mulailah dari sapaan, kepedulian, dan menjaga kenyamanan bersama.',
			content:
				'<p>Tetangga adalah orang yang paling dekat menyaksikan keseharian kita. Karena itu, akhlak kepada tetangga bukan perkara tambahan, melainkan buah dari iman yang hidup.</p><h2>Mulai dari hal yang sederhana</h2><p>Menyapa, berbagi makanan, menjaga suara, dan hadir ketika ada kesulitan adalah amal yang tampak kecil namun menguatkan kampung.</p><blockquote>Lingkungan yang teduh dibangun dari hati yang saling menjaga.</blockquote><h2>Jadikan masjid titik temu</h2><p>Masjid membantu kita mengenal nama, keadaan, dan kebutuhan warga. Dari sinilah ukhuwah tumbuh menjadi pertolongan yang nyata.</p>',
			coverImage: covers.articleAdab,
			category: 'Akhlak',
			status: 'published',
			authorId: admin.id,
			publishedAt: daysFromNow(-7, 8)
		},
		{
			id: 'article-salat',
			title: 'Menjaga Salat Berjamaah di Tengah Kesibukan',
			slug: 'menjaga-salat-berjamaah-di-tengah-kesibukan',
			excerpt:
				'Kesibukan tidak harus menjauhkan kita dari saf. Beberapa kebiasaan kecil dapat membantu menjaga ritme berjamaah.',
			content:
				'<p>Salat berjamaah memberi jeda yang menata kembali hati. Ia mengajarkan kita untuk berhenti, merapikan niat, dan berdiri sejajar.</p><h2>Susun hari di sekitar waktu salat</h2><p>Catat jadwal salat, selesaikan pekerjaan penting lebih awal, dan ajak keluarga saling mengingatkan.</p><ul><li>Siapkan wudu sebelum berangkat.</li><li>Datang beberapa menit lebih awal.</li><li>Tinggalkan ponsel dalam mode senyap.</li></ul>',
			coverImage: covers.articleSalat,
			category: 'Fikih',
			status: 'published',
			authorId: admin.id,
			publishedAt: daysFromNow(-4, 8)
		},
		{
			id: 'article-sirah',
			title: 'Masjid dalam Sirah: Pusat Ibadah dan Peradaban',
			slug: 'masjid-dalam-sirah-pusat-ibadah-dan-peradaban',
			excerpt:
				'Sejak masa Rasulullah, masjid menjadi ruang ibadah, belajar, bermusyawarah, dan saling menguatkan.',
			content:
				'<p>Masjid Nabawi menunjukkan bahwa masjid tidak terpisah dari denyut kehidupan umat. Di sana ilmu diajarkan, tamu diterima, dan persoalan masyarakat diselesaikan dengan hikmah.</p><h2>Pelajaran untuk kita</h2><p>Memakmurkan masjid berarti menghidupkan salat sekaligus pelayanan. Setiap jamaah dapat mengambil bagian sesuai kemampuan.</p>',
			coverImage: covers.articleSirah,
			category: 'Sirah',
			status: 'published',
			authorId: admin.id,
			publishedAt: daysFromNow(-2, 8)
		},
		{
			id: 'article-draft',
			title: 'Catatan Menyambut Bulan Muharram',
			slug: 'catatan-menyambut-bulan-muharram',
			excerpt: 'Draf materi untuk menyambut tahun baru Hijriah.',
			content: '<p>Materi sedang disiapkan oleh pengurus.</p>',
			coverImage: covers.articleMuharram,
			category: 'Sirah',
			status: 'draft',
			authorId: admin.id,
			publishedAt: null
		}
	])
	.onConflictDoNothing();

await db
	.insert(schema.activities)
	.values([
		{
			id: 'activity-cleanup',
			title: 'Kerja Bakti & Sarapan Bersama',
			description:
				'Membersihkan area masjid dan lingkungan sekitar, lalu ditutup dengan sarapan bersama warga.',
			startsAt: daysFromNow(3, 6, 30),
			location: 'Halaman Masjid Ar-Rahmah',
			coverImage: covers.activityCleanup
		},
		{
			id: 'activity-charity',
			title: 'Santunan Yatim dan Dhuafa',
			description:
				'Penyaluran amanah jamaah kepada anak yatim dan keluarga yang membutuhkan di lingkungan sekitar.',
			startsAt: daysFromNow(10, 9),
			location: 'Aula Utama',
			coverImage: covers.activityCharity
		},
		{
			id: 'activity-youth',
			title: 'Malam Bina Iman Remaja',
			description:
				'Malam kebersamaan remaja dengan tadabbur, diskusi ringan, dan kegiatan kreatif.',
			startsAt: daysFromNow(17, 19, 30),
			location: 'Ruang Serbaguna',
			coverImage: covers.activityYouth
		},
		{
			id: 'activity-past',
			title: 'Bazar UMKM Jamaah',
			description: 'Bazar produk rumahan warga untuk menguatkan ekonomi jamaah.',
			startsAt: daysFromNow(-14, 7),
			location: 'Halaman Masjid',
			coverImage: covers.activityBazaar
		}
	])
	.onConflictDoNothing();

await db
	.insert(schema.studies)
	.values([
		{
			id: 'study-fikih',
			speaker: 'Ust. Ahmad Farid',
			topic: 'Fikih Salat Berjamaah',
			startsAt: daysFromNow(1, 18, 30),
			location: 'Ruang Utama',
			recurrence: 'Setiap Jumat'
		},
		{
			id: 'study-muslimah',
			speaker: 'Ustazah Nur Aini',
			topic: 'Menjadi Ibu yang Menumbuhkan Iman',
			startsAt: daysFromNow(3, 9),
			location: 'Aula Muslimah',
			recurrence: 'Pekan pertama'
		},
		{
			id: 'study-tafsir',
			speaker: 'Ust. H. Abdul Malik',
			topic: 'Tafsir Surah Al-Hujurat',
			startsAt: daysFromNow(5, 5, 30),
			location: 'Ruang Utama',
			recurrence: 'Setiap Ahad'
		},
		{
			id: 'study-youth',
			speaker: 'Ust. Farhan Ramli',
			topic: 'Menjaga Hati di Era Digital',
			startsAt: daysFromNow(8, 19, 30),
			location: 'Ruang Serbaguna',
			recurrence: 'Dua pekan sekali'
		},
		{
			id: 'study-aqidah',
			speaker: 'Ust. Yusuf Mahendra',
			topic: 'Mengenal Nama-Nama Allah',
			startsAt: daysFromNow(12, 18, 30),
			location: 'Ruang Utama',
			recurrence: 'Kajian tematik'
		}
	])
	.onConflictDoNothing();

const articleCoverUpdates = [
	['article-adab', covers.articleAdab],
	['article-salat', covers.articleSalat],
	['article-sirah', covers.articleSirah],
	['article-draft', covers.articleMuharram]
] as const;
for (const [id, coverImage] of articleCoverUpdates) {
	await db.update(schema.articles).set({ coverImage }).where(eq(schema.articles.id, id));
}

const activityCoverUpdates = [
	['activity-cleanup', covers.activityCleanup],
	['activity-charity', covers.activityCharity],
	['activity-youth', covers.activityYouth],
	['activity-past', covers.activityBazaar]
] as const;
for (const [id, coverImage] of activityCoverUpdates) {
	await db.update(schema.activities).set({ coverImage }).where(eq(schema.activities.id, id));
}

console.log(`Seed selesai. Username pengurus: ${username.toLowerCase()}`);
sqlite.close();
