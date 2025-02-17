import { redirect } from '@sveltejs/kit';

// TODO: eventually, make a home page lol
export async function GET({ locals: { getCurrentProfile } }) {
	const currentProfile = getCurrentProfile();

	if (currentProfile) {
		redirect(302, '/browse');
	} else {
		redirect(302, '/login');
	}
}
