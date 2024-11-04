import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getCurrentUser } }) => {
	const currentUser = await getCurrentUser();

	return {
		currentUser
	};
};
