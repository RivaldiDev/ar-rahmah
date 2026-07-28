PRAGMA foreign_keys = ON;
BEGIN IMMEDIATE;

INSERT INTO finance_funds (
	id,
	name,
	description,
	source,
	sort_order,
	created_at
)
VALUES (
	'dana-sosial',
	'Dana Sosial Sakit & Kematian',
	'Bantuan bagi warga yang sakit serta keluarga warga yang meninggal.',
	'Infak sosial dan iuran keliling warga',
	4,
	CAST(strftime('%s', 'now') AS INTEGER) * 1000
)
ON CONFLICT(id) DO UPDATE SET
	name = excluded.name,
	description = excluded.description,
	source = excluded.source,
	sort_order = excluded.sort_order;

UPDATE finance_transactions
SET fund_id = 'dana-sosial'
WHERE fund_id IN ('orang-sakit', 'kematian');

DELETE FROM finance_funds
WHERE id IN ('orang-sakit', 'kematian');

COMMIT;
