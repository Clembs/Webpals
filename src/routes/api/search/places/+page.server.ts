import { fail, redirect } from '@sveltejs/kit';
import cityTimezones from 'city-timezones';

export const actions = {
	async default({ locals: { getCurrentProfile }, request }) {
		const currentProfile = getCurrentProfile();

		if (!currentProfile) redirect(401, '/login');

		if (!currentProfile.widgets.find((c) => c.find((w) => w.id === 'clock'))) {
			return fail(400, {
				message: 'No clock widget found on your profile.'
			});
		}

		const formData = await request.formData();
		const query = formData.get('query')?.toString();

		if (!query) {
			return fail(400, {
				message: 'Please enter a query.'
			});
		}

		const cities = cityTimezones.findFromCityStateProvince(query);

		if (!cities.length) {
			return fail(404, {
				message: 'Place not found. Try to pick a larger city near you or search your country.'
			});
		}

		return {
			cities: cities.slice(0, 10)
		};
	}
};
