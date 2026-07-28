import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { financeTransactions } from '$lib/server/db/schema';
import { getFinanceReport } from '$lib/server/finance';

export const load: PageServerLoad = async ({ url }) => getFinanceReport(url.searchParams);

export const actions: Actions = {
	delete: async ({ request }) => {
		const id = (await request.formData()).get('id')?.toString() ?? '';
		if (!/^[0-9a-f-]{36}$/i.test(id)) return fail(400, { message: 'Transaksi tidak valid.' });
		const deleted = await db
			.delete(financeTransactions)
			.where(eq(financeTransactions.id, id))
			.returning({ id: financeTransactions.id });
		if (!deleted.length) return fail(404, { message: 'Transaksi tidak ditemukan.' });
		return { success: true };
	}
};
