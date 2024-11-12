import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getCurrentUser }, depends }) => {
	const currentUser = await getCurrentUser();

	depends('layout:user');

	return {
		currentUser
	};
};
