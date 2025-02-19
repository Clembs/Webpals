import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { defaultWidgets } from '$lib/widgets/default-widgets';
import { db } from '$lib/db';
import { profiles } from '$lib/db/schema/profiles';
import { eq } from 'drizzle-orm';

export async function addWidget({ locals: { getCurrentProfile }, url }: RequestEvent) {
	const user = await getCurrentProfile();

	if (!user) redirect(302, '/login');

	const widgetId = url.searchParams.get('id');
	const widget = defaultWidgets.find(({ id }) => id === widgetId);

	if (!widgetId || !widget) {
		return fail(400, {
			message: 'Invalid widget ID'
		});
	}

	await db
		.update(profiles)
		.set({
			widgets: [user.widgets[0], [...user.widgets[1], widget]]
		})
		.where(eq(profiles.id, user.id));

	return {};
}
