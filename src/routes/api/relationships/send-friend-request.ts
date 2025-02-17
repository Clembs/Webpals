import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { and, eq, sql } from 'drizzle-orm';
import { relationships, RelationshipTypes, profiles } from '$lib/db/schema/users';
import { db } from '$lib/db';
import {
	notifications,
	notificationsMentionedProfiles,
	NotificationTypes
} from '$lib/db/schema/notifications';

export async function sendFriendRequest({ locals: { getCurrentProfile }, request }: RequestEvent) {
	const currentProfile = await getCurrentProfile();

	if (!currentProfile) redirect(401, '/login');

	const originUrl = new URL(request.headers.get('referer')!);
	const recipientUsername = originUrl.pathname.split('/').at(-1);

	if (!recipientUsername) {
		return fail(400, {
			message: 'Invalid recipient user ID. Try refreshing the page.'
		});
	}

	if (recipientUsername === currentProfile.username) {
		return fail(400, {
			message: 'You cannot send a friend request to yourself.'
		});
	}

	const recipient = await db.query.profiles.findFirst({
		where: eq(sql`LOWER(${profiles.username})`, recipientUsername.toLowerCase())
	});

	if (!recipient) {
		return fail(400, {
			message: 'Recipient user not found.'
		});
	}

	// find relationships where the current user is the initiator
	const existingFriendship = currentProfile.initiatedRelationships.find(
		(relationship) => relationship.recipientId === recipient.id
	);

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
	const receivedFriendship = currentProfile.receivedRelationships.find(
		(relationship) => relationship.recipientId === currentProfile.id
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
					eq(relationships.profileId, recipient.id),
					eq(relationships.recipientId, currentProfile.id)
				)
			);

		// also create a new relationship for the current user
		await db.insert(relationships).values({
			profileId: currentProfile.id,
			recipientId: recipient.id,
			status: RelationshipTypes.Friend
		});

		// send a friend request accepted notification to the recipient
		const [notification] = await db
			.insert(notifications)
			.values({
				profileId: recipient.id,
				type: NotificationTypes.FriendRequestAccepted
			})
			.returning();

		await db.insert(notificationsMentionedProfiles).values({
			notificationId: notification.id,
			profileId: currentProfile.id
		});

		// remove the pending notification from the current user
		const pendingNotification = currentProfile.notifications.find(
			(n) =>
				n.type === NotificationTypes.FriendRequest &&
				n.mentionedProfiles[0].profileId === recipient.id
		);
		if (pendingNotification) {
			await db
				.delete(notificationsMentionedProfiles)
				.where(eq(notificationsMentionedProfiles.notificationId, pendingNotification.id));

			await db.delete(notifications).where(eq(notifications.id, pendingNotification.id));
		}
	} else {
		// otherwise, create a new relationship with the status of pending
		await db.insert(relationships).values({
			profileId: currentProfile.id,
			recipientId: recipient.id,
			status: RelationshipTypes.FriendPending
		});

		// send a notification to the recipient
		const [notification] = await db
			.insert(notifications)
			.values({
				profileId: recipient.id,
				type: NotificationTypes.FriendRequest
			})
			.returning();

		await db.insert(notificationsMentionedProfiles).values({
			notificationId: notification.id,
			profileId: currentProfile.id
		});
	}

	// TODO: send email notification to recipient

	return {};
}
