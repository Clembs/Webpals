import { db } from '$lib/db';
import { publicUserColumns, users } from '$lib/db/schema/users';
import { HEARTBEAT_INTERVAL } from '$lib/helpers/constants';
import type { Handle } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('sessionId');

	event.locals.getSession = async () => {
		if (!sessionId) return null;

		return await db.query.sessions.findFirst({
			where: ({ id }, { eq }) => eq(id, sessionId)
		});
	};

	event.locals.getCurrentUser = async () => {
		const session = await event.locals.getSession();

		if (!session) return null;

		const user = await db.query.users.findFirst({
			where: ({ id }, { eq }) => eq(id, session.userId),
			with: {
				sessions: true,
				passkeys: true,
				notifications: {
					with: {
						mentionedUsers: {
							with: {
								user: {
									columns: publicUserColumns
								}
							}
						}
					}
				},
				initiatedRelationships: {
					with: {
						recipient: {
							columns: publicUserColumns
						}
					}
				},
				receivedRelationships: {
					with: {
						recipient: {
							columns: publicUserColumns
						}
					}
				}
			}
		});

		return user && { ...user, status: 'online' };
	};

	const user = await event.locals.getCurrentUser();

	// if the user hasn't sent a heartbeat in the past 3 minutes ago, update it (unless they're purposefully offline)
	if (
		user &&
		user.lastHeartbeat.getTime() < Date.now() - HEARTBEAT_INTERVAL &&
		user.status !== 'offline'
	) {
		await db
			.update(users)
			.set({
				lastHeartbeat: new Date()
			})
			.where(eq(users.id, user.id));
	}

	return await resolve(event);
};
