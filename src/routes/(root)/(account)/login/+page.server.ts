import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
// import { verifyPasskeyChallenge } from './verify-passkey-challenge';
import { handleAuthFlow } from './handle-auth-flow';

export const load: PageServerLoad = async ({ parent, locals: { getCurrentProfile } }) => {
	const currentProfile = await getCurrentProfile();

	if (currentProfile) {
		redirect(302, `/${currentProfile.username}`);
	}

	return {
		login: (await parent()).login || ''
	};
};

export const actions: Actions = {
	handleAuthFlow
	// verifyPasskeyChallenge
};
