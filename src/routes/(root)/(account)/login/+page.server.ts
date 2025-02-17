import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
// import { verifyPasskeyChallenge } from './verify-passkey-challenge';
import { handleAuthFlow } from './handle-auth-flow';

export const load: PageServerLoad = async ({ parent, locals: { getCurrentProfile } }) => {
	const currentUser = await getCurrentProfile();

	if (currentUser) {
		redirect(302, `/${currentUser.username}`);
	}

	return {
		login: (await parent()).login || ''
	};
};

export const actions: Actions = {
	handleAuthFlow
	// verifyPasskeyChallenge
};
