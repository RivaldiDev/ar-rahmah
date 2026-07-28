import { DEFAULT_PRAYER_LOCATION, formatPeriod, getPeriod } from '$lib/domain/prayer-times';
import { getPrayerLocations, getPrayerSchedule } from '$lib/server/prayer-times';
import { error, type RequestHandler } from '@sveltejs/kit';
import PDFDocument from 'pdfkit';

const columns = [
	['Imsak', 'imsak'],
	['Subuh', 'subuh'],
	['Terbit', 'terbit'],
	['Dhuha', 'dhuha'],
	['Zuhur', 'dzuhur'],
	['Asar', 'ashar'],
	['Magrib', 'maghrib'],
	['Isya', 'isya']
] as const;

export const GET: RequestHandler = async ({ fetch, url }) => {
	const period = getPeriod(url.searchParams.get('period'));
	const requestedLocation = url.searchParams.get('location') ?? DEFAULT_PRAYER_LOCATION.id;

	try {
		const locations = await getPrayerLocations(fetch);
		const locationId = locations.some((location) => location.id === requestedLocation)
			? requestedLocation
			: DEFAULT_PRAYER_LOCATION.id;
		const schedule = await getPrayerSchedule(locationId, period, fetch);
		const document = new PDFDocument({
			size: 'A4',
			layout: 'landscape',
			margin: 36,
			info: {
				Title: `Jadwal Salat ${schedule.location} - ${formatPeriod(period)}`,
				Author: 'Masjid Ar-Rahmah'
			}
		});
		const chunks: Buffer[] = [];
		document.on('data', (chunk: Buffer) => chunks.push(chunk));

		document.fillColor('#0A3D91').font('Helvetica-Bold').fontSize(22);
		document.text('Jadwal Salat Bulanan', 36, 32);
		document.fontSize(12).text(`${schedule.location}, ${schedule.province}`, 36, 61);
		document.fillColor('#2C3E50').font('Helvetica').fontSize(10).text(formatPeriod(period), 36, 80);

		const tableX = 36;
		const tableY = 102;
		const dateWidth = 170;
		const timeWidth = 73;
		const rowHeight = 13;
		const tableWidth = dateWidth + timeWidth * columns.length;

		document.rect(tableX, tableY, tableWidth, 24).fill('#0A3D91');
		document.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(8);
		document.text('Tanggal', tableX + 6, tableY + 8, { width: dateWidth - 12 });
		columns.forEach(([label], index) => {
			document.text(label, tableX + dateWidth + index * timeWidth, tableY + 8, {
				width: timeWidth,
				align: 'center'
			});
		});

		schedule.rows.forEach((row, rowIndex) => {
			const y = tableY + 24 + rowIndex * rowHeight;
			if (rowIndex % 2 === 1) document.rect(tableX, y, tableWidth, rowHeight).fill('#EAF6FF');
			document.fillColor('#2C3E50').font('Helvetica').fontSize(7.5);
			document.text(row.label, tableX + 6, y + 2.5, { width: dateWidth - 12 });
			columns.forEach(([, key], columnIndex) => {
				document.text(row[key], tableX + dateWidth + columnIndex * timeWidth, y + 2.5, {
					width: timeWidth,
					align: 'center'
				});
			});
		});

		const footerY = tableY + 24 + schedule.rows.length * rowHeight + 12;
		document
			.fillColor('#516A82')
			.fontSize(7.5)
			.text(
				'Sumber data: API Muslim myQuran. Ikuti azan dan ketetapan masjid setempat.',
				tableX,
				footerY
			);
		document.end();

		await new Promise<void>((resolve, reject) => {
			document.on('end', resolve);
			document.on('error', reject);
		});

		const filename = `jadwal-salat-${schedule.location.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}-${period}.pdf`;
		return new Response(Buffer.concat(chunks), {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="${filename}"`,
				'Cache-Control': 'public, max-age=900'
			}
		});
	} catch (cause) {
		console.error('Gagal membuat PDF jadwal salat', cause);
		error(503, 'PDF jadwal salat belum dapat dibuat.');
	}
};
