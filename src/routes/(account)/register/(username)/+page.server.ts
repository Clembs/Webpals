import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { USERNAME_REGEX } from '$lib/helpers/constants';
import { db } from '$lib/db';
import { _getValidInviteCode } from '../verify-invite-code/+page.server';

export const actions: Actions = {
	async validateUsername({ request, url, cookies }) {
		const formData = await request.formData();

		const username = formData.get('username')?.toString();
		const email = url.searchParams.get('email')?.toString();

		if (!username || !USERNAME_REGEX.test(username)) {
			return fail(400, {
				message: 'Invalid username. Check the requirements and try again.'
			});
		}

		const userWithUsername = await db.query.users.findFirst({
			where: ({ username: dbUsername }, { eq, sql }) =>
				eq(sql`LOWER(${dbUsername})`, username.toLowerCase())
		});

		if (userWithUsername) {
			return fail(409, {
				message: 'Username already in use. Please try something else!'
			});
		}

		const inviteCodeCookie = cookies.get('invite-code');

		if (inviteCodeCookie && !!_getValidInviteCode(inviteCodeCookie)) {
			redirect(307, `/register/email-input?username=${username}${email ? `&email=${email}` : ''}`);
		} else {
			redirect(
				307,
				`/register/verify-invite-code?username=${username}${email ? `&email=${email}` : ''}`
			);
		}
	}
};
