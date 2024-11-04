import { error } from '@sveltejs/kit';
import { db } from '$lib/db';
import { users } from '$lib/db/schema/users';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { HEARTBEAT_INTERVAL } from '$lib/helpers/constants';

export const POST: RequestHandler = async ({ locals: { getCurrentUser } }) => {
	const user = await getCurrentUser();

	if (!user) return error(401, 'Unauthorized');

	// if the last heartbeat was less than 3 minutes ago, ignore it to prevent spamming
	if (user.lastHeartbeat.getTime() > Date.now() - HEARTBEAT_INTERVAL)
		return new Response(null, { status: 204 });

	// if the user is purposefully offline, don't update the heartbeat
	if (user.status === 'offline') return new Response(null, { status: 204 });

	await db
		.update(users)
		.set({
			lastHeartbeat: new Date()
		})
		.where(eq(users.id, user.id));

	return new Response(null, { status: 204 });
};
