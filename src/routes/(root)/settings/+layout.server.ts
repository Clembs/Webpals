import { redirect } from '@sveltejs/kit';

export async function load({ locals: { getCurrentProfile, getSession } }) {
	const currentProfile = getCurrentProfile();
	const { user: currentUser } = getSession();

	if (!currentProfile || !currentUser) redirect(302, '/login');

	return {
		currentUser,
		currentProfile
	};
}
