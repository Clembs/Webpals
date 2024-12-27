import { db } from '$lib/db';
import { inviteCodes } from '$lib/db/schema/auth';
import { redirect, fail } from '@sveltejs/kit';

export const actions = {
	async default({ locals: { getCurrentUser } }) {
		const user = await getCurrentUser();

		if (!user) redirect(301, '/login');

		if (user.inviteCodes.length >= 10) {
			return fail(403, {
				message: 'You have reached the maximum number of invite codes'
			});
		}

		// random 5 character alphanumeric code (base 16)
		const randomCode = Math.random().toString(16).substring(2, 7);

		await db.insert(inviteCodes).values({
			code: randomCode,
			userId: user.id
		});

		return {
			code: randomCode
		};
	}
};
