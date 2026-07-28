import { strToU8, zipSync } from 'fflate';
import { formatFinanceDate } from '$lib/domain/finance';
import type { getFinanceReport } from '$lib/server/finance';

type FinanceReport = Awaited<ReturnType<typeof getFinanceReport>>;

const xml = (value: string) =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');

const textCell = (reference: string, value: string, style = 0) =>
	`<c r="${reference}" t="inlineStr" s="${style}"><is><t xml:space="preserve">${xml(value)}</t></is></c>`;
const numberCell = (reference: string, value: number, style = 0) =>
	`<c r="${reference}" s="${style}"><v>${value}</v></c>`;
const formulaCell = (reference: string, formula: string, value: number, style = 4) =>
	`<c r="${reference}" s="${style}"><f>${xml(formula)}</f><v>${value}</v></c>`;
const row = (index: number, cells: string, height?: number) =>
	`<row r="${index}"${height ? ` ht="${height}" customHeight="1"` : ''}>${cells}</row>`;

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

function buildSummarySheet(report: FinanceReport, generatedAt: Date) {
	const dataStart = 5;
	const transactionDataEnd = Math.max(5, 4 + report.transactions.length);
	const fundRows = report.funds.map((fund, index) => {
		const sheetRow = dataStart + index;
		const matching = report.transactions.filter((transaction) => transaction.fundId === fund.id);
		const income = matching.reduce(
			(total, transaction) => total + (transaction.type === 'income' ? transaction.amount : 0),
			0
		);
		const expense = matching.reduce(
			(total, transaction) => total + (transaction.type === 'expense' ? transaction.amount : 0),
			0
		);
		const fundName = xml(fund.name).replaceAll('"', '""');
		return row(
			sheetRow,
			textCell(`A${sheetRow}`, fund.name, 6) +
				formulaCell(
					`B${sheetRow}`,
					`SUMIFS(Transaksi!$H$5:$H$${transactionDataEnd},Transaksi!$C$5:$C$${transactionDataEnd},"${fundName}")`,
					income
				) +
				formulaCell(
					`C${sheetRow}`,
					`SUMIFS(Transaksi!$I$5:$I$${transactionDataEnd},Transaksi!$C$5:$C$${transactionDataEnd},"${fundName}")`,
					expense
				) +
				formulaCell(`D${sheetRow}`, `B${sheetRow}-C${sheetRow}`, income - expense, 5)
		);
	});
	const totalRow = dataStart + report.funds.length;
	const rows = [
		row(1, textCell('A1', 'Laporan Keuangan Masjid Ar-Rahmah', 1), 30),
		row(2, textCell('A2', describeFilters(report), 2)),
		row(
			3,
			textCell(
				'A3',
				`Dibuat ${new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(generatedAt)} WIB`,
				2
			)
		),
		row(
			4,
			textCell('A4', 'Dana', 3) +
				textCell('B4', 'Pemasukan', 3) +
				textCell('C4', 'Pengeluaran', 3) +
				textCell('D4', 'Saldo', 3),
			24
		),
		...fundRows,
		row(
			totalRow,
			textCell(`A${totalRow}`, 'TOTAL', 7) +
				formulaCell(
					`B${totalRow}`,
					`SUM(B${dataStart}:B${totalRow - 1})`,
					report.filteredSummary.income,
					5
				) +
				formulaCell(
					`C${totalRow}`,
					`SUM(C${dataStart}:C${totalRow - 1})`,
					report.filteredSummary.expense,
					5
				) +
				formulaCell(
					`D${totalRow}`,
					`SUM(D${dataStart}:D${totalRow - 1})`,
					report.filteredSummary.balance,
					5
				),
			22
		),
		row(totalRow + 2, textCell(`A${totalRow + 2}`, 'Catatan', 6)),
		row(
			totalRow + 3,
			textCell(
				`A${totalRow + 3}`,
				'Saldo dihitung otomatis dari pemasukan dikurangi pengeluaran pada hasil filter.',
				2
			)
		)
	].join('');
	return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<dimension ref="A1:D${totalRow + 3}"/><sheetViews><sheetView workbookViewId="0"><pane ySplit="4" topLeftCell="A5" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
<cols><col min="1" max="1" width="34" customWidth="1"/><col min="2" max="4" width="22" customWidth="1"/></cols>
<sheetData>${rows}</sheetData><autoFilter ref="A4:D${totalRow - 1}"/><mergeCells count="3"><mergeCell ref="A1:D1"/><mergeCell ref="A2:D2"/><mergeCell ref="A3:D3"/></mergeCells>
<pageMargins left="0.4" right="0.4" top="0.5" bottom="0.5" header="0.2" footer="0.2"/><pageSetup orientation="landscape" fitToWidth="1" fitToHeight="0" paperSize="9"/></worksheet>`;
}

function buildTransactionsSheet(report: FinanceReport) {
	const dataRows = report.transactions.map((transaction, index) => {
		const sheetRow = 5 + index;
		return row(
			sheetRow,
			numberCell(`A${sheetRow}`, index + 1) +
				textCell(`B${sheetRow}`, formatFinanceDate(transaction.transactionDate)) +
				textCell(`C${sheetRow}`, transaction.fundName) +
				textCell(
					`D${sheetRow}`,
					transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
					transaction.type === 'income' ? 8 : 9
				) +
				textCell(`E${sheetRow}`, transaction.description) +
				textCell(`F${sheetRow}`, transaction.reference ?? '-') +
				textCell(`G${sheetRow}`, transaction.createdByName) +
				(transaction.type === 'income'
					? numberCell(`H${sheetRow}`, transaction.amount, 4)
					: numberCell(`H${sheetRow}`, 0, 4)) +
				(transaction.type === 'expense'
					? numberCell(`I${sheetRow}`, transaction.amount, 4)
					: numberCell(`I${sheetRow}`, 0, 4))
		);
	});
	const dataEnd = Math.max(5, 4 + report.transactions.length);
	const totalRow = report.transactions.length ? dataEnd + 1 : 6;
	const rows = [
		row(1, textCell('A1', 'Rincian Transaksi Keuangan', 1), 30),
		row(2, textCell('A2', describeFilters(report), 2)),
		row(3, textCell('A3', `${report.transactions.length} transaksi`, 2)),
		row(
			4,
			[
				'No.',
				'Tanggal',
				'Dana',
				'Jenis',
				'Keterangan',
				'Referensi',
				'Diinput oleh',
				'Pemasukan',
				'Pengeluaran'
			]
				.map((label, index) => textCell(`${String.fromCharCode(65 + index)}4`, label, 3))
				.join(''),
			24
		),
		...dataRows,
		row(
			totalRow,
			textCell(`A${totalRow}`, 'TOTAL', 7) +
				formulaCell(`H${totalRow}`, `SUM(H5:H${dataEnd})`, report.filteredSummary.income, 5) +
				formulaCell(`I${totalRow}`, `SUM(I5:I${dataEnd})`, report.filteredSummary.expense, 5),
			22
		)
	].join('');
	return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><dimension ref="A1:I${totalRow}"/>
<sheetViews><sheetView workbookViewId="0"><pane ySplit="4" topLeftCell="A5" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
<cols><col min="1" max="1" width="7" customWidth="1"/><col min="2" max="2" width="16" customWidth="1"/><col min="3" max="4" width="24" customWidth="1"/><col min="5" max="5" width="46" customWidth="1"/><col min="6" max="7" width="24" customWidth="1"/><col min="8" max="9" width="20" customWidth="1"/></cols>
<sheetData>${rows}</sheetData><autoFilter ref="A4:I${dataEnd}"/><mergeCells count="3"><mergeCell ref="A1:I1"/><mergeCell ref="A2:I2"/><mergeCell ref="A3:I3"/></mergeCells>
<pageMargins left="0.25" right="0.25" top="0.4" bottom="0.4" header="0.2" footer="0.2"/><pageSetup orientation="landscape" fitToWidth="1" fitToHeight="0" paperSize="9"/></worksheet>`;
}

const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="1"><numFmt numFmtId="164" formatCode="&quot;Rp&quot; #,##0;[Red]-&quot;Rp&quot; #,##0"/></numFmts>
<fonts count="5"><font><sz val="10"/><name val="Aptos"/></font><font><b/><sz val="18"/><color rgb="FF0A3D91"/><name val="Aptos Display"/></font><font><sz val="10"/><color rgb="FF526A81"/><name val="Aptos"/></font><font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Aptos"/></font><font><b/><sz val="10"/><color rgb="FF0A3D91"/><name val="Aptos"/></font></fonts>
<fills count="5"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0A3D91"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFEAF6FF"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFDFF4E7"/><bgColor indexed="64"/></patternFill></fill></fills>
<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFD9E8F5"/></left><right style="thin"><color rgb="FFD9E8F5"/></right><top style="thin"><color rgb="FFD9E8F5"/></top><bottom style="thin"><color rgb="FFD9E8F5"/></bottom><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="10"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="0" fontId="3" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf><xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/><xf numFmtId="164" fontId="4" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"/></cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;

export function createFinanceWorkbook(report: FinanceReport, generatedAt = new Date()) {
	const files: Record<string, Uint8Array> = {
		'[Content_Types].xml': strToU8(
			`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`
		),
		'_rels/.rels': strToU8(
			`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`
		),
		'xl/workbook.xml': strToU8(
			`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Ringkasan" sheetId="1" r:id="rId1"/><sheet name="Transaksi" sheetId="2" r:id="rId2"/></sheets><calcPr calcId="191029" fullCalcOnLoad="1" forceFullCalc="1"/></workbook>`
		),
		'xl/_rels/workbook.xml.rels': strToU8(
			`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`
		),
		'xl/styles.xml': strToU8(styles),
		'xl/worksheets/sheet1.xml': strToU8(buildSummarySheet(report, generatedAt)),
		'xl/worksheets/sheet2.xml': strToU8(buildTransactionsSheet(report)),
		'docProps/core.xml': strToU8(
			`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Laporan Keuangan Masjid Ar-Rahmah</dc:title><dc:creator>Masjid Ar-Rahmah</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${generatedAt.toISOString()}</dcterms:created></cp:coreProperties>`
		),
		'docProps/app.xml': strToU8(
			`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Ar-Rahmah</Application><TitlesOfParts><vt:vector size="2" baseType="lpstr"><vt:lpstr>Ringkasan</vt:lpstr><vt:lpstr>Transaksi</vt:lpstr></vt:vector></TitlesOfParts></Properties>`
		)
	};
	return Buffer.from(zipSync(files, { level: 6 }));
}
