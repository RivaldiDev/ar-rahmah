import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = new Database(env.DATABASE_URL);
client.pragma('foreign_keys = ON');
client.pragma('journal_mode = WAL');
client.pragma('synchronous = NORMAL');
client.pragma('busy_timeout = 5000');
client.pragma('trusted_schema = OFF');

export const db = drizzle(client, { schema });
