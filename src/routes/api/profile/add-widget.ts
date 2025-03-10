import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { defaultWidgets } from '$lib/widgets/default-widgets';
import { db } from '$lib/db';
import { profiles } from '$lib/db/schema/profiles';
import { eq } from 'drizzle-orm';

export async function addWidget({
	locals: { getCurrentProfile },
	url,
	getClientAddress
}: RequestEvent) {
	const currentProfile = getCurrentProfile();

	if (!currentProfile) redirect(302, '/login');

	const widgetId = url.searchParams.get('id');
	const widget = defaultWidgets.find(({ id }) => id === widgetId);

	if (!widgetId || !widget) {
		return fail(400, {
			message: 'Invalid widget ID'
		});
	}

	const generatedWidget = await widget.generateDefault({
		clientAddress: getClientAddress(),
		profile: currentProfile
	});

	await db
		.update(profiles)
		.set({
			widgets: [currentProfile.widgets[0], [...currentProfile.widgets[1], generatedWidget]]
		})
		.where(eq(profiles.id, currentProfile.id));

	return {};
}
