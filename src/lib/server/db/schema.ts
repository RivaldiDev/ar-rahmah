import { sql } from 'drizzle-orm';
import { blob, index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './auth.schema';

const createdAt = () =>
	integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull();

const updatedAt = () =>
	integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => new Date())
		.notNull();

export const categories = sqliteTable('categories', {
	id: text('id').primaryKey(),
	name: text('name').notNull().unique(),
	slug: text('slug').notNull().unique()
});

export const articles = sqliteTable(
	'articles',
	{
		id: text('id').primaryKey(),
		title: text('title').notNull(),
		slug: text('slug').notNull().unique(),
		excerpt: text('excerpt').notNull(),
		content: text('content').notNull(),
		coverImage: text('cover_image').notNull(),
		category: text('category').notNull(),
		status: text('status', { enum: ['draft', 'published'] })
			.notNull()
			.default('draft'),
		authorId: text('author_id')
			.notNull()
			.references(() => user.id, { onDelete: 'restrict' }),
		publishedAt: integer('published_at', { mode: 'timestamp_ms' }),
		createdAt: createdAt(),
		updatedAt: updatedAt()
	},
	(table) => [
		index('articles_status_idx').on(table.status),
		index('articles_slug_idx').on(table.slug)
	]
);

export const activities = sqliteTable(
	'activities',
	{
		id: text('id').primaryKey(),
		title: text('title').notNull(),
		description: text('description').notNull(),
		startsAt: integer('starts_at', { mode: 'timestamp_ms' }).notNull(),
		location: text('location').notNull(),
		coverImage: text('cover_image').notNull(),
		createdAt: createdAt(),
		updatedAt: updatedAt()
	},
	(table) => [index('activities_starts_at_idx').on(table.startsAt)]
);

export const studies = sqliteTable(
	'studies',
	{
		id: text('id').primaryKey(),
		speaker: text('speaker').notNull(),
		topic: text('topic').notNull(),
		startsAt: integer('starts_at', { mode: 'timestamp_ms' }).notNull(),
		location: text('location').notNull(),
		recurrence: text('recurrence')
	},
	(table) => [index('studies_starts_at_idx').on(table.startsAt)]
);

export const financeFunds = sqliteTable('finance_funds', {
	id: text('id').primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description').notNull(),
	source: text('source').notNull(),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: createdAt()
});

export const financeTransactions = sqliteTable(
	'finance_transactions',
	{
		id: text('id').primaryKey(),
		fundId: text('fund_id')
			.notNull()
			.references(() => financeFunds.id, { onDelete: 'restrict' }),
		type: text('type', { enum: ['income', 'expense'] }).notNull(),
		amount: integer('amount').notNull(),
		transactionDate: integer('transaction_date', { mode: 'timestamp_ms' }).notNull(),
		description: text('description').notNull(),
		reference: text('reference'),
		createdBy: text('created_by')
			.notNull()
			.references(() => user.id, { onDelete: 'restrict' }),
		createdAt: createdAt(),
		updatedAt: updatedAt()
	},
	(table) => [
		index('finance_transactions_fund_idx').on(table.fundId),
		index('finance_transactions_date_idx').on(table.transactionDate),
		index('finance_transactions_type_idx').on(table.type)
	]
);

export const media = sqliteTable('media', {
	id: text('id').primaryKey(),
	filename: text('filename').notNull(),
	mimeType: text('mime_type').notNull(),
	data: blob('data', { mode: 'buffer' }).notNull(),
	createdAt: createdAt()
});

export * from './auth.schema';
