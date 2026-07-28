import { error, type RequestHandler } from '@sveltejs/kit';
import { getFinanceReport } from '$lib/server/finance';
import { createFinancePdf } from '$lib/server/finance-pdf';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const pdf = await createFinancePdf(await getFinanceReport(url.searchParams));
		const date = new Intl.DateTimeFormat('en-CA', {
			timeZone: 'Asia/Jakarta'
		}).format(new Date());
		return new Response(pdf, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="laporan-keuangan-ar-rahmah-${date}.pdf"`,
				'Cache-Control': 'no-store, private'
			}
		});
	} catch (cause) {
		console.error('Gagal membuat PDF keuangan', { errorId: crypto.randomUUID(), cause });
		error(500, 'Laporan PDF belum dapat dibuat.');
	}
};
