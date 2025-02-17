import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import {
	notifications,
	notificationsMentionedProfiles,
	NotificationTypes
} from '$lib/db/schema/notifications';
import { inArray } from 'drizzle-orm';

export async function deleteAllNotifications({ locals: { getCurrentProfile } }: RequestEvent) {
	const currentProfile = getCurrentProfile();

	if (!currentProfile) redirect(302, '/login');

	// filter out friend requests to have the user purposefully take action on them
	const allNonInteractiveNotifications = currentProfile.notifications.filter(
		(n) => n.type !== NotificationTypes.FriendRequest
	);

	await db.delete(notificationsMentionedProfiles).where(
		inArray(
			notificationsMentionedProfiles.notificationId,
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
