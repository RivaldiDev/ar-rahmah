import { and, asc, desc, eq, gte, inArray, lte } from 'drizzle-orm';
import {
	financeFundPresets,
	legacySocialFinanceFundIds,
	normalizeFinanceFundId,
	SOCIAL_FINANCE_FUND_ID,
	type FinanceTransactionType
} from '$lib/domain/finance';
import { db } from '$lib/server/db';
import { financeFunds, financeTransactions, user } from '$lib/server/db/schema';
import {
	FormValidationError,
	optionalString,
	parseJakartaDate,
	parseRupiahAmount,
	requiredString
} from '$lib/server/forms';

export interface FinanceFilters {
	fundId: string;
	type: FinanceTransactionType | '';
	from: string;
	to: string;
}

export interface FinanceTransactionInput {
	fundId: string;
	type: FinanceTransactionType;
	amount: number;
	transactionDate: Date;
	description: string;
	reference: string | null;
}

export async function ensureFinanceFunds() {
	db.transaction((transaction) => {
		for (const fund of financeFundPresets) {
			transaction
				.insert(financeFunds)
				.values(fund)
				.onConflictDoUpdate({
					target: financeFunds.id,
					set: {
						name: fund.name,
						description: fund.description,
						source: fund.source,
						sortOrder: fund.sortOrder
					}
				})
				.run();
		}
		transaction
			.update(financeTransactions)
			.set({ fundId: SOCIAL_FINANCE_FUND_ID })
			.where(inArray(financeTransactions.fundId, [...legacySocialFinanceFundIds]))
			.run();
		transaction
			.delete(financeFunds)
			.where(inArray(financeFunds.id, [...legacySocialFinanceFundIds]))
			.run();
	});
}

export async function getFinanceFunds() {
	await ensureFinanceFunds();
	return db
		.select()
		.from(financeFunds)
		.orderBy(asc(financeFunds.sortOrder), asc(financeFunds.name));
}

function normalizedDateFilter(value: string | null) {
	if (!value) return '';
	try {
		parseJakartaDate(value);
		return value;
	} catch {
		return '';
	}
}

export function parseFinanceFilters(searchParams: URLSearchParams, validFundIds: Set<string>) {
	const requestedFund = normalizeFinanceFundId(searchParams.get('fund') ?? '');
	const requestedType = searchParams.get('type');
	let from = normalizedDateFilter(searchParams.get('from'));
	let to = normalizedDateFilter(searchParams.get('to'));
	if (from && to && from > to) [from, to] = [to, from];
	return {
		fundId: validFundIds.has(requestedFund) ? requestedFund : '',
		type: requestedType === 'income' || requestedType === 'expense' ? requestedType : '',
		from,
		to
	} satisfies FinanceFilters;
}

export async function getFinanceReport(searchParams: URLSearchParams) {
	const funds = await getFinanceFunds();
	const filters = parseFinanceFilters(searchParams, new Set(funds.map((fund) => fund.id)));
	const conditions = [];
	if (filters.fundId) conditions.push(eq(financeTransactions.fundId, filters.fundId));
	if (filters.type) conditions.push(eq(financeTransactions.type, filters.type));
	if (filters.from)
		conditions.push(gte(financeTransactions.transactionDate, parseJakartaDate(filters.from)));
	if (filters.to)
		conditions.push(lte(financeTransactions.transactionDate, parseJakartaDate(filters.to)));

	const transactions = await db
		.select({
			id: financeTransactions.id,
			fundId: financeTransactions.fundId,
			fundName: financeFunds.name,
			type: financeTransactions.type,
			amount: financeTransactions.amount,
			transactionDate: financeTransactions.transactionDate,
			description: financeTransactions.description,
			reference: financeTransactions.reference,
			createdByName: user.name,
			createdAt: financeTransactions.createdAt,
			updatedAt: financeTransactions.updatedAt
		})
		.from(financeTransactions)
		.innerJoin(financeFunds, eq(financeTransactions.fundId, financeFunds.id))
		.innerJoin(user, eq(financeTransactions.createdBy, user.id))
		.where(conditions.length ? and(...conditions) : undefined)
		.orderBy(desc(financeTransactions.transactionDate), desc(financeTransactions.createdAt));

	const allTransactions = await db
		.select({
			fundId: financeTransactions.fundId,
			type: financeTransactions.type,
			amount: financeTransactions.amount
		})
		.from(financeTransactions);

	const fundSummaries = funds.map((fund) => {
		const rows = allTransactions.filter((transaction) => transaction.fundId === fund.id);
		const income = rows.reduce(
			(total, transaction) => total + (transaction.type === 'income' ? transaction.amount : 0),
			0
		);
		const expense = rows.reduce(
			(total, transaction) => total + (transaction.type === 'expense' ? transaction.amount : 0),
			0
		);
		return { ...fund, income, expense, balance: income - expense };
	});
	const filteredIncome = transactions.reduce(
		(total, transaction) => total + (transaction.type === 'income' ? transaction.amount : 0),
		0
	);
	const filteredExpense = transactions.reduce(
		(total, transaction) => total + (transaction.type === 'expense' ? transaction.amount : 0),
		0
	);

	return {
		funds,
		filters,
		transactions,
		fundSummaries,
		filteredSummary: {
			income: filteredIncome,
			expense: filteredExpense,
			balance: filteredIncome - filteredExpense,
			count: transactions.length
		},
		totalBalance: fundSummaries.reduce((total, fund) => total + fund.balance, 0)
	};
}

export async function getFinanceTransactionById(id: string) {
	await ensureFinanceFunds();
	return db.select().from(financeTransactions).where(eq(financeTransactions.id, id)).get();
}

export async function readFinanceTransactionInput(
	form: FormData
): Promise<FinanceTransactionInput> {
	const fundId = normalizeFinanceFundId(requiredString(form, 'fundId', 80));
	const type = requiredString(form, 'type', 20);
	const validFund = await db
		.select({ id: financeFunds.id })
		.from(financeFunds)
		.where(eq(financeFunds.id, fundId))
		.get();
	if (!validFund) throw new FormValidationError('Jenis dana tidak valid');
	if (type !== 'income' && type !== 'expense') {
		throw new FormValidationError('Jenis transaksi tidak valid');
	}
	const reference = optionalString(form, 'reference', 120);
	return {
		fundId,
		type,
		amount: parseRupiahAmount(requiredString(form, 'amount', 30)),
		transactionDate: parseJakartaDate(requiredString(form, 'transactionDate', 20)),
		description: requiredString(form, 'description', 300),
		reference: reference || null
	};
}
