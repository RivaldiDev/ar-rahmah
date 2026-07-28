import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { financeTransactions } from '$lib/server/db/schema';
import { getFinanceFunds, readFinanceTransactionInput } from '$lib/server/finance';
import { FormValidationError, safeFormMessage } from '$lib/server/forms';

export const load: PageServerLoad = async () => ({ funds: await getFinanceFunds() });

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) redirect(303, '/admin/login');
		try {
			const input = await readFinanceTransactionInput(await request.formData());
			await db.insert(financeTransactions).values({
				id: crypto.randomUUID(),
				...input,
				createdBy: locals.user.id
			});
		} catch (error) {
			if (!(error instanceof FormValidationError)) {
				console.error('Transaksi keuangan gagal disimpan', {
					errorId: crypto.randomUUID(),
					error
				});
			}
			return fail(400, { message: safeFormMessage(error, 'Transaksi gagal disimpan.') });
		}
		redirect(303, '/admin/keuangan');
	}
};
