import { error } from '@sveltejs/kit';
import { db } from '$lib/db';
import { profiles } from '$lib/db/schema/users';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { HEARTBEAT_INTERVAL } from '$lib/helpers/constants';

export const POST: RequestHandler = async ({ locals: { getCurrentProfile } }) => {
	const user = await getCurrentProfile();

	if (!user) return error(401, 'Unauthorized');

	// fetch the user from the database since we update the last heartbeat on the getCurrentProfile method
	const actualUser = await db.query.profiles.findFirst({
		where: ({ id }, { eq }) => eq(id, user.id),
		columns: {
			lastHeartbeat: true
		}
	});

	// if the last heartbeat was less than 3 minutes ago, ignore it to prevent spamming
	if (actualUser!.lastHeartbeat.getTime() > Date.now() - HEARTBEAT_INTERVAL)
		return new Response(null, { status: 204 });

	// if the user is purposefully offline, don't update the heartbeat
	if (user.status === 'offline') return new Response(null, { status: 204 });

	await db
		.update(profiles)
		.set({
			lastHeartbeat: new Date()
		})
		.where(eq(profiles.id, user.id));

	return new Response(null, { status: 204 });
};
