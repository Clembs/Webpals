import { db } from '$lib/db';
import { publicUserQuery } from '$lib/db/schema/users';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('sessionId');

	const session = !sessionId
		? null
		: await db.query.sessions.findFirst({
				where: ({ id }, { eq }) => eq(id, sessionId)
			});

	const user = !session
		? null
		: await db.query.users.findFirst({
				where: ({ id }, { eq }) => eq(id, session.userId),
				with: {
					sessions: true,
					passkeys: true,
					inviteCodes: true,
					connections: true,
					notifications: {
						with: {
							mentionedUsers: {
								with: {
									user: publicUserQuery
								}
							}
						}
					},
					initiatedRelationships: {
						with: {
							recipient: publicUserQuery
						}
					},
					receivedRelationships: {
						with: {
							user: publicUserQuery
						}
					}
				}
			});

	event.locals.getCurrentUser = () => {
		return user && { ...user, lastHeartbeat: new Date() };
	};

	event.locals.getSession = () => session;

	return await resolve(event);
};
