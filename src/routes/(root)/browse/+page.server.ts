import { db } from '$lib/db';
import { publicUserQuery, users } from '$lib/db/schema/users';
import { count } from 'drizzle-orm';

export async function load() {
	const firstUsers = await db.query.users.findMany({
		...publicUserQuery,
		orderBy: ({ lastHeartbeat }, { desc }) => desc(lastHeartbeat),
		limit: 10
	});

	const [{ count: userCount }] = await db.select({ count: count() }).from(users);

	return {
		firstUsers,
		count: userCount,
		awaitedUsers: db.query.users.findMany({
			...publicUserQuery,
			orderBy: ({ lastHeartbeat }, { desc }) => desc(lastHeartbeat),
			offset: 10
		})
	};
}
