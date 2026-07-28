import { expect, test } from '@playwright/test';

process.loadEnvFile?.('.env');

test('homepage presents the mosque schedule and latest content', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toContainText('Teduh dalam ibadah');
	await expect(page.getByText('Waktu salat hari ini')).toBeVisible();
	await expect(page.getByRole('link', { name: 'Lihat jadwal pekan ini' })).toBeVisible();
	await expect(page.locator('.hero > img')).toHaveAttribute(
		'src',
		/images\/masjid-arrahmah-hero-(day|night)\.webp/
	);
});

test('mobile hero actions stay clear of the prayer schedule panel', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 740 });
	await page.goto('/');

	const action = page.getByRole('link', { name: 'Lihat jadwal pekan ini' });
	const prayerPanel = page.getByText('Waktu salat hari ini').locator('..').locator('..');
	const [actionBox, panelBox] = await Promise.all([
		action.boundingBox(),
		prayerPanel.boundingBox()
	]);

	expect(actionBox).not.toBeNull();
	expect(panelBox).not.toBeNull();
	expect(actionBox!.y + actionBox!.height + 12).toBeLessThanOrEqual(panelBox!.y);
});

test('article search filters the published list', async ({ page }) => {
	await page.goto('/artikel');
	await page.getByRole('searchbox', { name: 'Cari artikel' }).fill('bertetangga');
	await expect(page.getByRole('heading', { name: /Adab Bertetangga/ })).toBeVisible();
	await expect(page.getByText('1 artikel ditemukan')).toBeVisible();
});

test('article detail provides paginated reading and a recommendation rail', async ({ page }) => {
	await page.goto('/artikel/adab-bertetangga-yang-menumbuhkan-rahmah');
	await expect(page.getByText('Halaman 1 dari 2')).toBeVisible();
	await expect(page.getByRole('complementary', { name: 'Rekomendasi artikel' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Jelajahi tema lain.' })).toBeVisible();
	await expect(page.getByText('Pilihan untuk Anda')).toBeVisible();

	await page.getByRole('link', { name: 'Berikutnya' }).click();
	await expect(page).toHaveURL(/\?page=2$/);
	await expect(page.getByText('Halaman 2 dari 2')).toBeVisible();
});

test('article category links open a filtered listing', async ({ page }) => {
	await page.goto('/artikel?category=Akhlak');
	await expect(page.getByRole('button', { name: 'Akhlak' })).toHaveClass(/active/);
	await expect(page.getByText('1 artikel ditemukan')).toBeVisible();
});

test('about page shows the exact mosque location on an interactive map', async ({ page }) => {
	await page.goto('/tentang#lokasi');
	const committee = page.getByText('Susunan kepengurusan').locator('..').locator('..');
	await expect(committee.getByRole('img', { name: 'Ilustrasi H. Ahmad Fauzan' })).toBeVisible();
	await expect(committee.getByText('Ketua Takmir')).toBeVisible();
	await expect(committee.getByRole('heading', { name: 'H. Ahmad Fauzan' })).toBeVisible();
	const locationSection = page.locator('#lokasi');
	await expect(locationSection.getByText(`6°17'31.7"S 107°27'08.9"E`)).toBeVisible();

	const directionsLink = page.getByRole('link', { name: 'Buka petunjuk arah' });
	await expect(directionsLink).toHaveAttribute(
		'href',
		'https://www.google.com/maps/dir/?api=1&destination=-6.292139,107.452472'
	);

	await expect(page.getByTitle('Peta interaktif lokasi Masjid Ar-Rahmah')).toHaveAttribute(
		'src',
		/6\.292139%2C107\.452472/
	);
});

test('committee hierarchy keeps visible connector lines on mobile', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/tentang');

	const leaderConnector = await page.locator('.org-leader').evaluate((element) => {
		const style = getComputedStyle(element, '::after');
		return { content: style.content, height: Number.parseFloat(style.height), width: style.width };
	});
	const teamConnector = await page.locator('.org-team').evaluate((element) => {
		const style = getComputedStyle(element, '::before');
		return { content: style.content, width: style.width, background: style.backgroundColor };
	});

	expect(leaderConnector.content).not.toBe('none');
	expect(leaderConnector.height).toBeGreaterThanOrEqual(32);
	expect(leaderConnector.width).toBe('2px');
	expect(teamConnector.content).not.toBe('none');
	expect(teamConnector.width).toBe('2px');
	expect(teamConnector.background).not.toBe('rgba(0, 0, 0, 0)');
});

test('prayer schedule defaults to Karawang and can be downloaded as PDF', async ({ page }) => {
	await page.goto('/jadwal-salat');
	await expect(page.getByRole('heading', { name: 'Jadwal salat bulanan.' })).toBeVisible();
	await expect(page.getByLabel('Kabupaten atau kota')).toHaveValue(
		'1ff8a7b5dc7a7d1f0ed65aaa29c04b1e'
	);
	const summary = page.locator('aside');
	await expect(summary.getByRole('heading', { name: 'KAB. KARAWANG' })).toBeVisible();

	await page.getByLabel('Kabupaten atau kota').selectOption({ label: 'KOTA BANDUNG' });
	await page.getByRole('button', { name: 'Tampilkan jadwal' }).click();
	await expect(summary.getByRole('heading', { name: 'KOTA BANDUNG' })).toBeVisible();

	await expect(page.getByRole('button', { name: 'Unduh PDF' })).toBeVisible();
	const location = await page.getByLabel('Kabupaten atau kota').inputValue();
	const period = await page.getByLabel('Bulan', { exact: true }).inputValue();
	const response = await page.request.get(
		`/jadwal-salat/pdf?location=${encodeURIComponent(location)}&period=${encodeURIComponent(period)}`
	);
	expect(response.status()).toBe(200);
	expect(response.headers()['content-type']).toContain('application/pdf');
	expect((await response.body()).subarray(0, 4).toString()).toBe('%PDF');
});

test('public pages remain free of horizontal overflow on a small phone', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 800 });

	for (const path of ['/', '/kegiatan', '/pengajian', '/artikel', '/tentang', '/jadwal-salat']) {
		await page.goto(path);
		const dimensions = await page.evaluate(() => ({
			scrollWidth: document.documentElement.scrollWidth,
			clientWidth: document.documentElement.clientWidth
		}));
		expect(dimensions.scrollWidth, `${path} should not overflow horizontally`).toBeLessThanOrEqual(
			dimensions.clientWidth
		);
	}
});

test('admin routes are protected and invited staff can sign in', async ({ page }) => {
	await page.goto('/admin');
	await expect(page).toHaveURL(/\/admin\/login$/);
	await expect(page.getByLabel('Email')).toHaveCount(0);
	await page.getByLabel('Username').fill(process.env.ADMIN_USERNAME ?? 'admin');
	await page.getByLabel('Kata sandi').fill(process.env.ADMIN_PASSWORD ?? '');
	await page.getByRole('button', { name: 'Masuk ke dashboard' }).click();
	await expect(page).toHaveURL(/\/admin$/);
	await expect(page.getByRole('heading', { name: 'Ringkasan hari ini.' })).toBeVisible();

	await page.goto('/admin/artikel/new');
	await expect(page.getByText('Pilih template sampul')).toBeVisible();
	await expect(page.getByRole('radio')).toHaveCount(10);
	await expect(page.getByRole('radio', { name: /Fikih/ })).toBeChecked();
});

test('pengurus can manage finance transactions and download filtered reports', async ({ page }) => {
	const marker = Date.now();
	const initialDescription = `Infak kotak depan masjid - uji ${marker}`;
	const updatedDescription = `Infak kotak depan masjid - diperbarui ${marker}`;
	await page.goto('/admin/login');
	await page.getByLabel('Username').fill(process.env.ADMIN_USERNAME ?? 'admin');
	await page.getByLabel('Kata sandi').fill(process.env.ADMIN_PASSWORD ?? '');
	await page.getByRole('button', { name: 'Masuk ke dashboard' }).click();

	await page.goto('/admin/keuangan/new');
	await expect(page.getByLabel('Jenis dana').locator('option')).toHaveCount(4);
	await expect(
		page.getByLabel('Jenis dana').locator('option', { hasText: 'Dana Sosial Sakit & Kematian' })
	).toHaveCount(1);
	await expect(
		page.getByLabel('Jenis dana').locator('option', { hasText: 'Dana Sosial Orang Sakit' })
	).toHaveCount(0);
	await expect(
		page.getByLabel('Jenis dana').locator('option', { hasText: 'Dana Kematian' })
	).toHaveCount(0);
	await page.getByLabel('Jenis dana').selectOption('kas-masjid');
	await page.getByLabel('Jenis transaksi').selectOption('income');
	await page.getByLabel('Nominal (rupiah)').fill('1.250.000');
	await page.getByLabel('Tanggal transaksi').fill('2026-07-23');
	await page.getByRole('textbox', { name: 'Keterangan', exact: true }).fill(initialDescription);
	await page.getByLabel(/Referensi/).fill('E2E-001');
	await page.getByRole('button', { name: 'Simpan transaksi' }).click();
	await expect(page).toHaveURL(/\/admin\/keuangan$/);

	let row = page.getByRole('row').filter({ hasText: initialDescription });
	await expect(row).toContainText(/Rp\s?1\.250\.000/);
	await row.getByRole('link', { name: 'Edit' }).click();
	await page.getByRole('textbox', { name: 'Keterangan', exact: true }).fill(updatedDescription);
	await page.getByRole('button', { name: 'Perbarui transaksi' }).click();

	await page.locator('select[name="fund"]').selectOption('kas-masjid');
	await page.getByRole('button', { name: 'Tampilkan' }).click();
	const excel = await page.request.get('/admin/keuangan/export.xlsx?fund=kas-masjid');
	const pdf = await page.request.get('/admin/keuangan/export.pdf?fund=kas-masjid');
	expect(excel.status()).toBe(200);
	expect(excel.headers()['content-type']).toContain('spreadsheetml.sheet');
	expect((await excel.body()).subarray(0, 2).toString()).toBe('PK');
	expect(pdf.status()).toBe(200);
	expect(pdf.headers()['content-type']).toContain('application/pdf');
	expect((await pdf.body()).subarray(0, 4).toString()).toBe('%PDF');

	row = page.getByRole('row').filter({ hasText: updatedDescription });
	page.once('dialog', (dialog) => dialog.accept());
	await row.getByRole('button', { name: 'Hapus' }).click();
	await expect(page.getByText(updatedDescription)).toHaveCount(0);

	await page.setViewportSize({ width: 320, height: 800 });
	await page.goto('/admin/keuangan');
	const dimensions = await page.evaluate(() => ({
		scrollWidth: document.documentElement.scrollWidth,
		clientWidth: document.documentElement.clientWidth
	}));
	expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
	await expect(page.getByRole('button', { name: 'Buka menu admin' })).toBeVisible();
});
