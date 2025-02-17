import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import { relationships, RelationshipTypes } from '$lib/db/schema/users';
import {
	notifications,
	notificationsMentionedProfiles,
	NotificationTypes
} from '$lib/db/schema/notifications';
import { and, eq } from 'drizzle-orm';
import { generateSnowflake } from '$lib/helpers/users';

export async function acceptFriendRequest({ locals: { getCurrentProfile }, url }: RequestEvent) {
	const currentUser = await getCurrentProfile();

	if (!currentUser) redirect(401, '/login');

	const recipientId = url.searchParams.get('id');

	const relationship = currentUser.receivedRelationships.find((r) => r.profileId === recipientId);

	if (!recipientId || !relationship) {
		return fail(400, {
			message: 'Invalid friend ID or no request found. Try refreshing the page.'
		});
	}

	if (relationship.status === RelationshipTypes.Friend) {
		return fail(400, {
			message: 'You are already friends with this user.'
		});
	}

	if (relationship.status !== RelationshipTypes.FriendPending) {
		return fail(400, {
			message: 'This user did not send you a friend request.'
		});
	}

	// update the received relationship to be a friend
	await db
		.update(relationships)
		.set({
			status: RelationshipTypes.Friend
		})
		.where(
			and(eq(relationships.profileId, recipientId), eq(relationships.recipientId, currentUser.id))
		);

	// also create a new relationship for the current user
	await db.insert(relationships).values({
		profileId: currentUser.id,
		recipientId,
		status: RelationshipTypes.Friend
	});

	// send a friend request accepted notification to the recipient
	const [notification] = await db
		.insert(notifications)
		.values({
			id: generateSnowflake(),
			profileId: recipientId,
			type: NotificationTypes.FriendRequestAccepted
		})
		.returning();

	await db.insert(notificationsMentionedProfiles).values({
		notificationId: notification.id,
		profileId: currentUser.id
	});

	// remove the pending notification from the current user
	const pendingNotification = currentUser.notifications.find(
		(n) =>
			n.type === NotificationTypes.FriendRequest && n.mentionedProfiles[0].profileId === recipientId
	);

	if (pendingNotification) {
		await db
			.delete(notificationsMentionedProfiles)
			.where(eq(notificationsMentionedProfiles.notificationId, pendingNotification.id));

		await db.delete(notifications).where(eq(notifications.id, pendingNotification.id));
	}

	return {};
}
