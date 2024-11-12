import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import {
	notifications,
	notificationsMentionedUsers,
	NotificationTypes
} from '$lib/db/schema/notifications';
import { inArray } from 'drizzle-orm';

export async function deleteAllNotifications({ locals: { getCurrentUser } }: RequestEvent) {
	const user = await getCurrentUser();

	if (!user) redirect(302, '/login');

	// filter out friend requests to have the user purposefully take action on them
	const allNonInteractiveNotifications = user.notifications.filter(
		(n) => n.type !== NotificationTypes.FriendRequest
	);

	await db.delete(notificationsMentionedUsers).where(
		inArray(
			notificationsMentionedUsers.notificationId,
			allNonInteractiveNotifications.map((n) => n.id)
		)
	);

	await db.delete(notifications).where(
		inArray(
			notifications.id,
			allNonInteractiveNotifications.map((n) => n.id)
		)
	);

	return {};
}
