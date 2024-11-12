import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import {
	notifications,
	notificationsMentionedUsers,
	NotificationTypes
} from '$lib/db/schema/notifications';
import { and, eq } from 'drizzle-orm';
import { relationships, RelationshipTypes } from '$lib/db/schema/users';

export async function deleteNotification({ url, locals: { getCurrentUser } }: RequestEvent) {
	const user = await getCurrentUser();

	if (!user) redirect(302, '/login');

	const notificationId = url.searchParams.get('id');
	const notification = user.notifications.find((n) => n.id === notificationId);

	if (!notificationId || !notification) {
		return fail(400, {
			message: 'Notification not found'
		});
	}

	await db
		.delete(notificationsMentionedUsers)
		.where(eq(notificationsMentionedUsers.notificationId, notificationId));

	await db.delete(notifications).where(eq(notifications.id, notificationId));

	// if the notification was a friend request, delete the friend request relationship
	if (notification.type === NotificationTypes.FriendRequest) {
		const sourceUser = notification.mentionedUsers[0].user!;

		await db
			.delete(relationships)
			.where(
				and(
					eq(relationships.recipientId, user.id),
					eq(relationships.userId, sourceUser.id),
					eq(relationships.status, RelationshipTypes.FriendPending)
				)
			);
	}

	return {};
}
