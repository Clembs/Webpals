import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import { notifications } from '$lib/db/schema/notifications';
import { eq } from 'drizzle-orm';

export async function markAllAsRead({ locals: { getCurrentProfile } }: RequestEvent) {
	const currentUser = await getCurrentProfile();

	if (!currentUser) redirect(302, '/login');

	await db
		.update(notifications)
		.set({
			read: true
		})
		.where(eq(notifications.profileId, currentUser.id));

	return {};
}
