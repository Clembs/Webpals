import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, locals: { getCurrentUser } }) => {
	const user = await getCurrentUser();

	if (user) redirect(302, `/${user.id}`);

	const username = url.searchParams.get('username') || '';
	const email = url.searchParams.get('email') || '';

	return {
		username,
		email
	};
};
