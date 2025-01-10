import { redirect } from '@sveltejs/kit';

// TODO: eventually, make a home page lol
export async function GET({ locals: { getCurrentUser } }) {
	const currentUser = getCurrentUser();

	if (currentUser) {
		redirect(302, '/browse');
	} else {
		redirect(302, '/login');
	}
}
