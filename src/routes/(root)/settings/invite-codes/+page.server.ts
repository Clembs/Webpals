import { db } from '$lib/db';
import { inviteCodes } from '$lib/db/schema/auth';
import { redirect, fail } from '@sveltejs/kit';

export async function load({ locals: { getCurrentProfile } }) {
	const user = await getCurrentProfile();

	if (user?.username.toLowerCase() !== 'clembs') {
		redirect(301, '/settings/account');
	}
}

export const actions = {
	async default({ locals: { getCurrentProfile } }) {
		const currentProfile = getCurrentProfile();

		if (!currentProfile) redirect(301, '/login');

		if (currentProfile.inviteCodes.length >= 10) {
			return fail(403, {
				message: 'You have reached the maximum number of invite codes'
			});
		}

		// random 5 character alphanumeric code (base 16)
		const randomCode = Math.random().toString(16).substring(2, 7);

		await db.insert(inviteCodes).values({
			code: randomCode,
			issuerId: currentProfile.id
		});

		return {
			code: randomCode
		};
	}
};
