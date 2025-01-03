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

	const session = await event.locals.getSession();

	const user = await db.query.users.findFirst({
		where: ({ id }, { eq }) => eq(id, session?.userId || ''),
		with: {
			sessions: true,
			passkeys: true,
			inviteCodes: true,
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
					user: {
						columns: publicUserColumns
					}
				}
			}
		}
	});

	event.locals.getCurrentUser = async () => {
		return user && { ...user, status: 'online' };
	};

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
