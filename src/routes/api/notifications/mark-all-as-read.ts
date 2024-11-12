import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import { notifications } from '$lib/db/schema/notifications';
import { eq } from 'drizzle-orm';

export async function markAllAsRead({ locals: { getCurrentUser } }: RequestEvent) {
	const currentUser = await getCurrentUser();

	if (!currentUser) redirect(302, '/login');

	await db
		.update(notifications)
		.set({
			read: true
		})
		.where(eq(notifications.userId, currentUser.id));

	return {};
}
