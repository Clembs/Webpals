import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { defaultWidgets } from '$lib/widgets/default-widgets';
import { db } from '$lib/db';
import { users } from '$lib/db/schema/users';
import { eq } from 'drizzle-orm';

export async function addWidget({ locals: { getCurrentUser }, url }: RequestEvent) {
	const user = await getCurrentUser();

	if (!user) redirect(302, '/login');

	const widgetId = url.searchParams.get('id');
	const widget = defaultWidgets.find(({ id }) => id === widgetId);

	if (!widgetId || !widget) {
		return fail(400, {
			message: 'Invalid widget ID'
		});
	}

	await db
		.update(users)
		.set({
			widgets: [user.widgets[0], [...user.widgets[1], widget]]
		})
		.where(eq(users.id, user.id));

	return {};
}
