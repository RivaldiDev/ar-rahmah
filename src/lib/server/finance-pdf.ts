import PDFDocument from 'pdfkit';
import { formatFinanceDate, formatRupiah } from '$lib/domain/finance';
import type { getFinanceReport } from '$lib/server/finance';

type FinanceReport = Awaited<ReturnType<typeof getFinanceReport>>;

function describeFilters(report: FinanceReport) {
	const fund = report.funds.find((item) => item.id === report.filters.fundId)?.name ?? 'Semua dana';
	const type =
		report.filters.type === 'income'
			? 'Pemasukan'
			: report.filters.type === 'expense'
				? 'Pengeluaran'
				: 'Semua transaksi';
	const period =
		report.filters.from || report.filters.to
			? `${report.filters.from || 'awal'} s.d. ${report.filters.to || 'sekarang'}`
			: 'Seluruh periode';
	return `${fund} | ${type} | ${period}`;
}

export async function createFinancePdf(report: FinanceReport, generatedAt = new Date()) {
	const document = new PDFDocument({
		size: 'A4',
		layout: 'landscape',
		margin: 34,
		bufferPages: true,
		info: {
			Title: 'Laporan Keuangan Masjid Ar-Rahmah',
			Author: 'Masjid Ar-Rahmah'
		}
	});
	const chunks: Buffer[] = [];
	document.on('data', (chunk: Buffer) => chunks.push(chunk));

	document.fillColor('#0A3D91').font('Helvetica-Bold').fontSize(22).text('Laporan Keuangan');
	document.fontSize(12).text('Masjid Ar-Rahmah', { continued: false });
	document
		.fillColor('#526A81')
		.font('Helvetica')
		.fontSize(8.5)
		.text(describeFilters(report))
		.text(
			`Dibuat ${new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(generatedAt)} WIB`
		);

	let y = document.y + 14;
	const summaryColumns = [270, 145, 145, 145];
	const summaryHeaders = ['Dana', 'Pemasukan', 'Pengeluaran', 'Saldo'];
	document
		.rect(
			34,
			y,
			summaryColumns.reduce((total, width) => total + width, 0),
			22
		)
		.fill('#0A3D91');
	let x = 34;
	document.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(8);
	summaryHeaders.forEach((header, index) => {
		document.text(header, x + 6, y + 7, {
			width: summaryColumns[index] - 12,
			align: index ? 'right' : 'left'
		});
		x += summaryColumns[index];
	});
	y += 22;
	report.funds.forEach((fund, index) => {
		const transactions = report.transactions.filter(
			(transaction) => transaction.fundId === fund.id
		);
		const income = transactions.reduce(
			(total, transaction) => total + (transaction.type === 'income' ? transaction.amount : 0),
			0
		);
		const expense = transactions.reduce(
			(total, transaction) => total + (transaction.type === 'expense' ? transaction.amount : 0),
			0
		);
		if (index % 2 === 1) document.rect(34, y, 705, 20).fill('#EAF6FF');
		document.fillColor('#2C3E50').font('Helvetica').fontSize(8);
		x = 34;
		[
			fund.name,
			formatRupiah(income),
			formatRupiah(expense),
			formatRupiah(income - expense)
		].forEach((value, columnIndex) => {
			document.text(value, x + 6, y + 6, {
				width: summaryColumns[columnIndex] - 12,
				align: columnIndex ? 'right' : 'left'
			});
			x += summaryColumns[columnIndex];
		});
		y += 20;
	});
	document.rect(34, y, 705, 22).fill('#D9ECFC');
	document.fillColor('#0A3D91').font('Helvetica-Bold').fontSize(8);
	x = 34;
	[
		'TOTAL',
		formatRupiah(report.filteredSummary.income),
		formatRupiah(report.filteredSummary.expense),
		formatRupiah(report.filteredSummary.balance)
	].forEach((value, columnIndex) => {
		document.text(value, x + 6, y + 7, {
			width: summaryColumns[columnIndex] - 12,
			align: columnIndex ? 'right' : 'left'
		});
		x += summaryColumns[columnIndex];
	});

	const columns = [66, 120, 70, 190, 86, 88, 88];
	const headers = [
		'Tanggal',
		'Dana',
		'Jenis',
		'Keterangan',
		'Referensi',
		'Pemasukan',
		'Pengeluaran'
	];
	const tableWidth = columns.reduce((total, width) => total + width, 0);
	const drawTransactionHeader = (startY: number) => {
		document.rect(34, startY, tableWidth, 22).fill('#0A3D91');
		document.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(7.5);
		let headerX = 34;
		headers.forEach((header, index) => {
			document.text(header, headerX + 4, startY + 7, {
				width: columns[index] - 8,
				align: index >= 5 ? 'right' : 'left'
			});
			headerX += columns[index];
		});
		return startY + 22;
	};

	y += 40;
	document
		.fillColor('#0A3D91')
		.font('Helvetica-Bold')
		.fontSize(13)
		.text('Rincian transaksi', 34, y);
	document
		.fillColor('#526A81')
		.font('Helvetica')
		.fontSize(8)
		.text(`${report.transactions.length} transaksi`, 650, y + 3, { width: 89, align: 'right' });
	y = drawTransactionHeader(y + 22);
	if (!report.transactions.length) {
		document
			.fillColor('#526A81')
			.font('Helvetica')
			.fontSize(9)
			.text('Belum ada transaksi pada hasil filter ini.', 34, y + 14, {
				width: tableWidth,
				align: 'center'
			});
	}
	report.transactions.forEach((transaction, index) => {
		const descriptionHeight = document.heightOfString(transaction.description, {
			width: columns[3] - 8
		});
		const rowHeight = Math.max(22, Math.min(40, descriptionHeight + 10));
		if (y + rowHeight > 548) {
			document.addPage();
			y = 40;
			document
				.fillColor('#0A3D91')
				.font('Helvetica-Bold')
				.fontSize(12)
				.text('Laporan Keuangan - Rincian transaksi', 34, y);
			y = drawTransactionHeader(y + 20);
		}
		if (index % 2 === 1) document.rect(34, y, tableWidth, rowHeight).fill('#F5FAFF');
		document.fillColor('#2C3E50').font('Helvetica').fontSize(7.2);
		const values = [
			formatFinanceDate(transaction.transactionDate),
			transaction.fundName,
			transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
			transaction.description,
			transaction.reference ?? '-',
			transaction.type === 'income' ? formatRupiah(transaction.amount) : '-',
			transaction.type === 'expense' ? formatRupiah(transaction.amount) : '-'
		];
		x = 34;
		values.forEach((value, columnIndex) => {
			document.text(value, x + 4, y + 6, {
				width: columns[columnIndex] - 8,
				height: rowHeight - 8,
				align: columnIndex >= 5 ? 'right' : 'left',
				ellipsis: true
			});
			x += columns[columnIndex];
		});
		y += rowHeight;
	});

	const range = document.bufferedPageRange();
	for (let pageIndex = 0; pageIndex < range.count; pageIndex += 1) {
		document.switchToPage(range.start + pageIndex);
		document
			.fillColor('#71869A')
			.font('Helvetica')
			.fontSize(7)
			.text('Dokumen internal pengurus Masjid Ar-Rahmah', 34, 550, {
				width: 500,
				lineBreak: false
			})
			.text(`Halaman ${pageIndex + 1} dari ${range.count}`, 640, 550, {
				width: 99,
				align: 'right',
				lineBreak: false
			});
	}

	document.end();
	await new Promise<void>((resolve, reject) => {
		document.on('end', resolve);
		document.on('error', reject);
	});
	return Buffer.concat(chunks);
}
