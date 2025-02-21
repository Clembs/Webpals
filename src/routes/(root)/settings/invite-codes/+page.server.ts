import { db } from '$lib/db';
import { inviteCodes } from '$lib/db/schema/auth';
import type { Profile } from '$lib/db/types';
import { redirect, fail } from '@sveltejs/kit';

function isClembs(profile: Profile | null | undefined) {
	return profile?.username.toLowerCase() === 'clembs';
}

export async function load({ locals: { getCurrentProfile } }) {
	const currentProfile = getCurrentProfile();
	const clembs = isClembs(currentProfile);

	if (!currentProfile || !isClembs(currentProfile)) {
		redirect(301, '/settings/account');
	}

	return {
		isClembs: clembs
	};
}

export const actions = {
	async default({ locals: { getCurrentProfile } }) {
		const currentProfile = getCurrentProfile();

		if (!currentProfile) redirect(301, '/login');

		const issuerInviteCodes = await db.query.inviteCodes.findMany({
			where: ({ issuerId }, { eq }) => eq(issuerId, currentProfile.id)
		});

		if (!isClembs(currentProfile) && issuerInviteCodes.length >= 10) {
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
