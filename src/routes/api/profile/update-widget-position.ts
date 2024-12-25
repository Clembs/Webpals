import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import { users } from '$lib/db/schema/users';
import { eq } from 'drizzle-orm';

export async function updateWidgetPosition({ locals: { getCurrentUser }, url }: RequestEvent) {
	const user = await getCurrentUser();

	if (!user) redirect(302, '/login');

	const widgetId = url.searchParams.get('id');
	const newPosition = parseInt(url.searchParams.get('new-position') || '');
	const newColumn = parseInt(url.searchParams.get('new-column') || '');

	if (!widgetId || isNaN(newPosition) || isNaN(newColumn)) {
		return fail(400, {
			message: 'Invalid widget ID, new position or new column.'
		});
	}

	if (newColumn > 2 || newColumn < 0 || newPosition < 0) {
		return fail(400, {
			message:
				'New column must be between 0 and 2 and/or new position must be greater than or equal to 0.'
		});
	}

	const lastPosition = user.widgets[newColumn].length - 1;

	if (newPosition > lastPosition + 1) {
		return fail(400, {
			message: `New position must be at most ${lastPosition + 1}.`
		});
	}

	const widget = user.widgets
		.find((c) => c.find((w) => w.id === widgetId))
		?.find((w) => w.id === widgetId);

	if (!widget) {
		return fail(400, {
			message: 'Invalid widget ID.'
		});
	}

	const newWidgets = user.widgets.map((column, i) => {
		const filteredColumn = column.filter((w) => w.id !== widgetId);

		// add to the new column
		if (i === newColumn) {
			filteredColumn.splice(newPosition, 0, widget);
		}

		return filteredColumn;
	});

	await db
		.update(users)
		.set({
			widgets: newWidgets
		})
		.where(eq(users.id, user.id));

	return {};
}
