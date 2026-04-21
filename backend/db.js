import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const { Pool } = pg;

function readEnv(name, fallback) {
  const v = process.env[name];
  return v === undefined || v === '' ? fallback : v;
}

function toBool(v) {
  return String(v).toLowerCase() === 'true';
}

const DATABASE_URL = readEnv('DATABASE_URL', '');

const DB_HOST = readEnv('DB_HOST', 'localhost');
const DB_PORT = Number(readEnv('DB_PORT', '5432'));
const DB_NAME = readEnv('DB_NAME', 'Keeper Notes');
const DB_USER = readEnv('DB_USER', 'postgres');
const DB_PASSWORD = readEnv('DB_PASSWORD', '');
const DB_SSL = toBool(readEnv('DB_SSL', 'false'));

const pool = DATABASE_URL
  ? new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      user: DB_USER,
      host: DB_HOST,
      database: DB_NAME,
      password: DB_PASSWORD,
      port: DB_PORT,
      ssl: DB_SSL ? { rejectUnauthorized: false } : undefined,
    });

// Log non-sensitive connection info for debugging in Render.
// (Helps confirm which env vars are actually used.)
const connectionSummary = DATABASE_URL
  ? { mode: 'DATABASE_URL', host: new URL(DATABASE_URL).host }
  : { mode: 'parts', host: DB_HOST, port: DB_PORT, database: DB_NAME, user: DB_USER, ssl: DB_SSL };
console.log('Postgres connection:', connectionSummary);

export default pool; 