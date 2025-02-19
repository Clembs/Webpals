import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import type { CustomWidget } from '$lib/widgets/types';
import { db } from '$lib/db';
import { profiles } from '$lib/db/schema/profiles';
import { eq } from 'drizzle-orm';
import { parse } from 'valibot';
import { CustomWidgetStructure } from '$lib/widgets/custom-widget-structure';

function mutateObject(
	obj: {
		[key: string]: unknown;
	},
	path: string,
	value: string
) {
	// Split the path by dot notation, handling array brackets (e.g., "smth[0].hello")
	const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');

	// Traverse the object, keeping a reference to the part that will be updated
	let current = obj;
	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i];
		// If the key does not exist, create an empty object or array
		if (!(key in current)) {
			current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
		}
		current = current[key] as { [key: string]: unknown };
	}

	// Set the final key to the new value
	current[keys[keys.length - 1]] = value;

	return obj;
}

export async function editCustomWidget({
	url,
	locals: { getCurrentProfile },
	request
}: RequestEvent) {
	const user = await getCurrentProfile();

	if (!user) redirect(302, '/login');

	const widgetId = url.searchParams.get('id');

	const widget = user.widgets
		.find((c) => c.find((w) => w.id === widgetId))
		?.find((w) => w.id === widgetId) as CustomWidget | undefined;

	if (!widget) {
		return fail(400, {
			message: 'Widget not found'
		});
	}

	const formData = await request.formData();
	const entries = [...formData.entries()];

	entries.forEach(([key, value]) => {
		mutateObject(widget, `blocks${key}`, value.toString());
	});

	// check that the widget is valid after mutation
	try {
		parse(CustomWidgetStructure, widget, {
			message: 'Invalid widget'
		});
	} catch (error) {
		return fail(400, {
			message: String(error)
		});
	}

	await db
		.update(profiles)
		.set({
			widgets: [...user.widgets.map((c) => c.map((w) => (w.id === widgetId ? widget : w)))]
		})
		.where(eq(profiles.id, user.id));

	return {};
}
