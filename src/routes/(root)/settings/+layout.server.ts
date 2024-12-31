import { redirect } from '@sveltejs/kit';

export async function load({ locals: { getCurrentUser } }) {
	const currentUser = await getCurrentUser();

	if (!currentUser) redirect(302, '/login');

	return {
		currentUser
	};
}
