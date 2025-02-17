import { db } from '$lib/db';
import { publicProfileQuery, profiles } from '$lib/db/schema/users';
import { count } from 'drizzle-orm';

export async function load() {
	const firstProfiles = await db.query.profiles.findMany({
		...publicProfileQuery,
		orderBy: ({ lastHeartbeat }, { desc }) => desc(lastHeartbeat),
		limit: 10
	});

	const [{ count: profileCount }] = await db.select({ count: count() }).from(profiles);

	return {
		firstProfiles,
		count: profileCount,
		awaitedProfiles: db.query.profiles.findMany({
			...publicProfileQuery,
			orderBy: ({ lastHeartbeat }, { desc }) => desc(lastHeartbeat),
			offset: 10
		})
	};
}
