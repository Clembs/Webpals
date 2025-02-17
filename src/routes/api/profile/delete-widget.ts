import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import { profiles } from '$lib/db/schema/users';
import { eq } from 'drizzle-orm';

export async function deleteWidget({ locals: { getCurrentProfile }, url }: RequestEvent) {
	const user = await getCurrentProfile();

	if (!user) redirect(302, '/login');

	const widgetId = url.searchParams.get('id');

	if (!widgetId || user.widgets.find((c) => c.find((w) => w.id === widgetId)) === undefined) {
		return fail(400, {
			message: 'Invalid widget ID.'
		});
	}

	await db
		.update(profiles)
		.set({
			widgets: user.widgets.map((column) => column.filter((w) => w.id !== widgetId))
		})
		.where(eq(profiles.id, user.id));

	return {};
}
