import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { financeTransactions } from '$lib/server/db/schema';
import {
	getFinanceFunds,
	getFinanceTransactionById,
	readFinanceTransactionInput
} from '$lib/server/finance';
import { FormValidationError, safeFormMessage } from '$lib/server/forms';

export const load: PageServerLoad = async ({ params }) => {
	const [funds, transaction] = await Promise.all([
		getFinanceFunds(),
		getFinanceTransactionById(params.id)
	]);
	if (!transaction) error(404, 'Transaksi tidak ditemukan');
	return { funds, transaction };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		if (!(await getFinanceTransactionById(params.id))) error(404, 'Transaksi tidak ditemukan');
		try {
			const input = await readFinanceTransactionInput(await request.formData());
			await db.update(financeTransactions).set(input).where(eq(financeTransactions.id, params.id));
		} catch (caught) {
			if (!(caught instanceof FormValidationError)) {
				console.error('Transaksi keuangan gagal diperbarui', {
					errorId: crypto.randomUUID(),
					error: caught
				});
			}
			return fail(400, {
				message: safeFormMessage(caught, 'Transaksi gagal diperbarui.')
			});
		}
		redirect(303, '/admin/keuangan');
	}
};
