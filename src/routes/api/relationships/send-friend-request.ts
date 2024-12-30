import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { and, eq, sql } from 'drizzle-orm';
import { relationships, RelationshipTypes, users } from '$lib/db/schema/users';
import { db } from '$lib/db';
import {
	notifications,
	notificationsMentionedUsers,
	NotificationTypes
} from '$lib/db/schema/notifications';
import { generateSnowflake } from '$lib/helpers/users';

export async function sendFriendRequest({ locals: { getCurrentUser }, request }: RequestEvent) {
	const currentUser = await getCurrentUser();

	if (!currentUser) redirect(401, '/login');

	const originUrl = new URL(request.headers.get('referer')!);
	const recipientUsername = originUrl.pathname.split('/').at(-1);

	if (!recipientUsername) {
		return fail(400, {
			message: 'Invalid recipient user ID. Try refreshing the page.'
		});
	}

	if (recipientUsername === currentUser.username) {
		return fail(400, {
			message: 'You cannot send a friend request to yourself.'
		});
	}

	const recipientUser = await db.query.users.findFirst({
		where: eq(sql`LOWER(${users.username})`, recipientUsername.toLowerCase())
	});

	if (!recipientUser) {
		return fail(400, {
			message: 'Recipient user not found.'
		});
	}

	// find relationships where the current user is the initiator
	const existingFriendship = currentUser.initiatedRelationships.find(
		(relationship) => relationship.recipientId === recipientUser.id
	);

	// console.log(currentUser.initiatedRelationships);
	// console.log(currentUser.receivedRelationships);

	if (existingFriendship?.status === RelationshipTypes.FriendPending) {
		return fail(400, {
			message: 'You already sent a friend request to this user.'
		});
	}

	if (existingFriendship?.status === RelationshipTypes.Friend) {
		return fail(400, {
			message: 'You are already friends with this user.'
		});
	}

	// find relationships where the current user is the recipient
	const receivedFriendship = currentUser.receivedRelationships.find(
		(relationship) => relationship.recipientId === currentUser.id
	);

	// if either user has blocked the other
	if (
		existingFriendship?.status === RelationshipTypes.Blocked ||
		receivedFriendship?.status === RelationshipTypes.Blocked
	) {
		return fail(400, {
			message: 'You cannot send a friend request to this user.'
		});
	}

	// if the recipient has already sent a friend request, directly accept it
	if (receivedFriendship?.status === RelationshipTypes.FriendPending) {
		// update the recevied relationship to be a friend
		await db
			.update(relationships)
			.set({
				status: RelationshipTypes.Friend
			})
			.where(
				and(
					eq(relationships.userId, recipientUser.id),
					eq(relationships.recipientId, currentUser.id)
				)
			);

		// also create a new relationship for the current user
		await db.insert(relationships).values({
			userId: currentUser.id,
			recipientId: recipientUser.id,
			status: RelationshipTypes.Friend
		});

		// send a friend request accepted notification to the recipient
		const [notification] = await db
			.insert(notifications)
			.values({
				id: generateSnowflake(),
				userId: recipientUser.id,
				type: NotificationTypes.FriendRequestAccepted
			})
			.returning();

		await db.insert(notificationsMentionedUsers).values({
			notificationId: notification.id,
			userId: currentUser.id
		});

		// remove the pending notification from the current user
		const pendingNotification = currentUser.notifications.find(
			(n) =>
				n.type === NotificationTypes.FriendRequest &&
				n.mentionedUsers[0].userId === recipientUser.id
		);
		if (pendingNotification) {
			await db
				.delete(notificationsMentionedUsers)
				.where(eq(notificationsMentionedUsers.notificationId, pendingNotification.id));

			await db.delete(notifications).where(eq(notifications.id, pendingNotification.id));
		}
	} else {
		// otherwise, create a new relationship with the status of pending
		await db.insert(relationships).values({
			userId: currentUser.id,
			recipientId: recipientUser.id,
			status: RelationshipTypes.FriendPending
		});

		// send a notification to the recipient
		const [notification] = await db
			.insert(notifications)
			.values({
				id: generateSnowflake(),
				userId: recipientUser.id,
				type: NotificationTypes.FriendRequest
			})
			.returning();

		await db.insert(notificationsMentionedUsers).values({
			notificationId: notification.id,
			userId: currentUser.id
		});
	}

	// TODO: send email notification to recipient

	return {};
}
