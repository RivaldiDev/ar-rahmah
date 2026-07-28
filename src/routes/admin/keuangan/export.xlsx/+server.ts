import { error, type RequestHandler } from '@sveltejs/kit';
import { getFinanceReport } from '$lib/server/finance';
import { createFinanceWorkbook } from '$lib/server/finance-xlsx';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const workbook = createFinanceWorkbook(await getFinanceReport(url.searchParams));
		const date = new Intl.DateTimeFormat('en-CA', {
			timeZone: 'Asia/Jakarta'
		}).format(new Date());
		return new Response(workbook, {
			headers: {
				'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'Content-Disposition': `attachment; filename="laporan-keuangan-ar-rahmah-${date}.xlsx"`,
				'Cache-Control': 'no-store, private'
			}
		});
	} catch (cause) {
		console.error('Gagal membuat Excel keuangan', { errorId: crypto.randomUUID(), cause });
		error(500, 'Laporan Excel belum dapat dibuat.');
	}
};
