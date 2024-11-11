import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import { relationships, RelationshipTypes } from '$lib/db/schema/users';
import {
	notifications,
	notificationsMentionedUsers,
	NotificationTypes
} from '$lib/db/schema/notifications';
import { and, eq } from 'drizzle-orm';
import { generateSnowflake } from '$lib/helpers/users';

export async function acceptFriendRequest({ locals: { getCurrentUser }, url }: RequestEvent) {
	const currentUser = await getCurrentUser();

	if (!currentUser) redirect(401, '/login');

	const recipientId = url.searchParams.get('id');

	console.log(recipientId);

	const relationship = currentUser.receivedRelationships.find((r) => r.userId === recipientId);

	if (!recipientId || !relationship) {
		return fail(400, {
			message: 'Invalid friend ID or no request found. Try refreshing the page.'
		});
	}

	// update the received relationship to be a friend
	await db
		.update(relationships)
		.set({
			status: RelationshipTypes.Friend
		})
		.where(
			and(eq(relationships.userId, recipientId), eq(relationships.recipientId, currentUser.id))
		);

	// also create a new relationship for the current user
	await db.insert(relationships).values({
		userId: currentUser.id,
		recipientId,
		status: RelationshipTypes.Friend
	});

	// send a friend request accepted notification to the recipient
	const [notification] = await db
		.insert(notifications)
		.values({
			id: generateSnowflake(),
			userId: recipientId,
			type: NotificationTypes.FriendRequestAccepted
		})
		.returning();

	await db.insert(notificationsMentionedUsers).values({
		notificationId: notification.id,
		userId: currentUser.id
	});

	// remove the pending notification from the current user
	const pendingNotification = currentUser.notifications.find(
		(n) => n.type === NotificationTypes.FriendRequest && n.mentionedUsers[0].userId === recipientId
	);

	if (pendingNotification) {
		await db
			.delete(notificationsMentionedUsers)
			.where(eq(notificationsMentionedUsers.notificationId, pendingNotification.id));

		await db.delete(notifications).where(eq(notifications.id, pendingNotification.id));
	}

	return {};
}
