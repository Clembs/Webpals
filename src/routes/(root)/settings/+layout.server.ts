import { db } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export async function load({ locals: { getCurrentProfile, getSession } }) {
	const currentProfile = getCurrentProfile();
	const { user: currentUser } = getSession();

	if (!currentProfile || !currentUser) redirect(302, '/login');

	const inviteCodes = await db.query.inviteCodes.findMany({
		where: ({ issuerId }, { eq }) => eq(issuerId, currentProfile.id),
		orderBy: ({ createdAt }, { desc }) => desc(createdAt),
		with: {
			claimedBy: true
		}
	});

	return {
		currentUser,
		currentProfile: {
			inviteCodes,
			...currentProfile
		}
	};
}
