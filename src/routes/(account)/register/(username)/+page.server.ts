import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { USERNAME_REGEX } from '$lib/helpers/constants';
import { db } from '$lib/db';

export const actions: Actions = {
	async validateUsername({ request, url }) {
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
				message: 'Username already in use.'
			});
		}

		throw redirect(307, `/register/email-input?username=${username}${email && `&email=${email}`}`);
	}
};
