import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export enum PostgresErrorCode {
  UniqueViolation = '23505',
}

const db = drizzle(process.env.DATABASE_URL!, { schema });

export default db;
