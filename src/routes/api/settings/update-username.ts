import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import { profiles, USERNAME_REGEX } from '$lib/db/schema/users';
import { eq } from 'drizzle-orm';

export async function updateUsername({ locals: { getCurrentProfile }, request }: RequestEvent) {
	const user = await getCurrentProfile();

	if (!user) redirect(302, '/login');

	const formData = await request.formData();
	const username = formData.get('username')?.toString();

	if (!username || !USERNAME_REGEX.test(username)) {
		return fail(400, {
			message: 'Invalid username. It must be between 2 and 24 characters long.'
		});
	}

	const userWithUsername = await db.query.profiles.findFirst({
		where: ({ username: dbUsername }, { eq }) => eq(dbUsername, username)
	});

	if (userWithUsername) {
		return fail(400, {
			message: 'Username is already taken. Please try something else.'
		});
	}

	await db
		.update(profiles)
		.set({
			username
		})
		.where(eq(profiles.id, user.id));

	const originUrl = new URL(request.headers.get('referer') || '/settings/account');

	if (originUrl.pathname === `/${user.username}`) {
		redirect(302, `/${username}`);
	}

	return {};
}
