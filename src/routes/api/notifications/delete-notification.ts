import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import {
	notifications,
	notificationsMentionedProfiles,
	NotificationTypes
} from '$lib/db/schema/notifications';
import { and, eq } from 'drizzle-orm';
import { relationships, RelationshipTypes } from '$lib/db/schema/users';

export async function deleteNotification({ url, locals: { getCurrentProfile } }: RequestEvent) {
	const currentProfile = getCurrentProfile();

	if (!currentProfile) redirect(302, '/login');

	const notificationId = url.searchParams.get('id');
	const notification = currentProfile.notifications.find((n) => n.id === notificationId);

	if (!notificationId || !notification) {
		return fail(400, {
			message: 'Notification not found'
		});
	}

	await db
		.delete(notificationsMentionedProfiles)
		.where(eq(notificationsMentionedProfiles.notificationId, notificationId));

	await db.delete(notifications).where(eq(notifications.id, notificationId));

	// if the notification was a friend request, delete the friend request relationship
	if (notification.type === NotificationTypes.FriendRequest) {
		const sourceProfile = notification.mentionedProfiles[0].profile!;

		await db
			.delete(relationships)
			.where(
				and(
					eq(relationships.recipientId, currentProfile.id),
					eq(relationships.profileId, sourceProfile.id),
					eq(relationships.status, RelationshipTypes.FriendPending)
				)
			);
	}

	return {};
}
