import postgres from 'postgres';
import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as auth from './schema/auth';
import * as profiles from './schema/profiles';
import * as notifications from './schema/notifications';

const client = postgres(DATABASE_URL);

export const db = drizzle(client, {
	casing: 'snake_case',
	schema: {
		...auth,
		...profiles,
		...notifications
	}
});
