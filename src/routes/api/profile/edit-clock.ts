import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import { profiles } from '$lib/db/schema/profiles';
import { eq } from 'drizzle-orm';
import cityTimezones from 'city-timezones';

export async function editClock({ locals: { getCurrentProfile }, request }: RequestEvent) {
	const currentProfile = getCurrentProfile();

	if (!currentProfile) redirect(302, '/login');

	const formData = await request.formData();
	const city = formData.get('city')?.toString();

	if (!city) {
		return fail(400, {
			message: 'Invalid city.'
		});
	}

	const cities = cityTimezones.lookupViaCity(city);

	if (!cities.length) {
		return fail(400, {
			message: 'Invalid city.'
		});
	}

	const cityData = cities[0];

	await db
		.update(profiles)
		.set({
			widgets: currentProfile.widgets.map((column) =>
				column.map((w) => {
					if (w.id === 'clock') {
						return {
							...w,
							country: cityData.country,
							city: cityData.city,
							timezone: cityData.timezone
						};
					}
					return w;
				})
			)
		})
		.where(eq(profiles.id, currentProfile.id));

	return {};
}
