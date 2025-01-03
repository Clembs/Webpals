import { db } from '$lib/db';
import { publicUserColumns } from '$lib/db/schema/users';
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

	event.locals.getCurrentUser = () => {
		return user && { ...user, lastHeartbeat: new Date() };
	};

	event.locals.getSession = () => session;

	return await resolve(event);
};
