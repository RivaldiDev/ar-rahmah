import { describe, expect, it } from 'vitest';
import { unzipSync, strFromU8 } from 'fflate';
import { createFinanceWorkbook } from './finance-xlsx';
import { createFinancePdf } from './finance-pdf';

const report = {
	funds: [
		{
			id: 'kas-masjid',
			name: 'Kas Masjid',
			description: 'Dana operasional',
			source: 'Kotak infak masjid',
			sortOrder: 1,
			createdAt: new Date('2026-07-01T00:00:00Z')
		}
	],
	filters: { fundId: '', type: '', from: '', to: '' },
	transactions: [
		{
			id: 'test-transaction',
			fundId: 'kas-masjid',
			fundName: 'Kas Masjid',
			type: 'income',
			amount: 1_250_000,
			transactionDate: new Date('2026-07-23T05:00:00Z'),
			description: 'Infak kotak depan masjid',
			reference: 'Kuitansi 001',
			createdByName: 'Pengurus',
			createdAt: new Date('2026-07-23T05:00:00Z'),
			updatedAt: new Date('2026-07-23T05:00:00Z')
		}
	],
	fundSummaries: [],
	filteredSummary: { income: 1_250_000, expense: 0, balance: 1_250_000, count: 1 },
	totalBalance: 1_250_000
} as const;

describe('finance exports', () => {
	it('creates a real XLSX workbook with summary formulas and transaction data', () => {
		const workbook = createFinanceWorkbook(report as never, new Date('2026-07-23T05:00:00Z'));
		expect(workbook.subarray(0, 2).toString()).toBe('PK');
		const files = unzipSync(workbook);
		expect(Object.keys(files)).toContain('xl/worksheets/sheet1.xml');
		const summary = strFromU8(files['xl/worksheets/sheet1.xml']);
		const transactions = strFromU8(files['xl/worksheets/sheet2.xml']);
		expect(summary).toContain('SUMIFS(Transaksi!');
		expect(transactions).toContain('Infak kotak depan masjid');
		expect(transactions).toContain('<v>1250000</v>');
	});

	it('creates a PDF report with the expected document signature', async () => {
		const pdf = await createFinancePdf(report as never, new Date('2026-07-23T05:00:00Z'));
		expect(pdf.subarray(0, 4).toString()).toBe('%PDF');
		expect(pdf.length).toBeGreaterThan(1_000);
	});
});
