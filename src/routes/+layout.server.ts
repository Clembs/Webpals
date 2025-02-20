import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getCurrentProfile }, depends }) => {
	const currentProfile = getCurrentProfile();

	depends('layout:profile');

	return {
		currentProfile
	};
};
