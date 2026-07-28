import { readFileSync } from 'node:fs';
import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';

let database: Database.Database | undefined;

afterEach(() => database?.close());

describe('social finance fund migration', () => {
	it('preserves every transaction and total balance while merging legacy funds', () => {
		database = new Database(':memory:');
		database.pragma('foreign_keys = ON');
		database.exec(`
			CREATE TABLE finance_funds (
				id TEXT PRIMARY KEY NOT NULL,
				name TEXT NOT NULL UNIQUE,
				description TEXT NOT NULL,
				source TEXT NOT NULL,
				sort_order INTEGER NOT NULL,
				created_at INTEGER NOT NULL
			);
			CREATE TABLE finance_transactions (
				id TEXT PRIMARY KEY NOT NULL,
				fund_id TEXT NOT NULL REFERENCES finance_funds(id) ON DELETE RESTRICT,
				type TEXT NOT NULL,
				amount INTEGER NOT NULL
			);
			INSERT INTO finance_funds VALUES
				('orang-sakit', 'Dana Sosial Orang Sakit', 'Sakit', 'Infak sosial', 4, 1),
				('kematian', 'Dana Kematian', 'Kematian', 'Iuran warga', 5, 1);
			INSERT INTO finance_transactions VALUES
				('income-sick', 'orang-sakit', 'income', 500000),
				('expense-sick', 'orang-sakit', 'expense', 125000),
				('income-death', 'kematian', 'income', 750000);
		`);

		const balanceBefore = database
			.prepare(
				"SELECT SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS balance FROM finance_transactions"
			)
			.get() as { balance: number };
		const migration = readFileSync(
			new URL('../../../scripts/migrations/merge-social-finance-funds.sql', import.meta.url),
			'utf8'
		);

		database.exec(migration);
		database.exec(migration);

		const funds = database.prepare('SELECT id, name FROM finance_funds ORDER BY id').all();
		const transactions = database
			.prepare('SELECT id, fund_id AS fundId FROM finance_transactions ORDER BY id')
			.all() as Array<{ id: string; fundId: string }>;
		const balanceAfter = database
			.prepare(
				"SELECT SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS balance FROM finance_transactions"
			)
			.get() as { balance: number };

		expect(funds).toEqual([{ id: 'dana-sosial', name: 'Dana Sosial Sakit & Kematian' }]);
		expect(transactions).toHaveLength(3);
		expect(new Set(transactions.map((transaction) => transaction.fundId))).toEqual(
			new Set(['dana-sosial'])
		);
		expect(balanceAfter.balance).toBe(balanceBefore.balance);
	});
});
