import { EMAIL_REGEX } from 'valibot';
import type { LayoutServerLoad } from './$types';
import { USERNAME_REGEX } from '$lib/db/schema/profiles';

export const load: LayoutServerLoad = async ({ url }) => {
	const login = url.searchParams.get('login');

	if (!login) return;

	const decodedLogin = decodeURI(login);

	if (decodedLogin && (EMAIL_REGEX.test(decodedLogin) || USERNAME_REGEX.test(decodedLogin))) {
		return {
			login
		};
	}
};
