import { db } from '$lib/db';
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { sql } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({
	params: { username },
	url,
	locals: { getCurrentUser }
}) => {
	const user = await db.query.users.findFirst({
		where: (user, { eq }) => eq(sql`LOWER(${user.username})`, username.toLowerCase()),
		columns: {
			id: true,
			avatar: true,
			displayName: true,
			last_online: true,
			pronouns: true,
			status: true,
			widgets: true,
			username: true,
			theme: true
		}
	});

	if (!user) throw error(404, 'User not found');

	// if the capitalization of the username is incorrect, redirect to the correct URL
	if (username !== user.username) {
		redirect(301, `/${user.username}`);
	}

	const currentUser = await getCurrentUser();
	const isCurrentUser = currentUser && currentUser.id === user.id;

	if (url.searchParams.has('edit')) {
		if (!isCurrentUser) {
			redirect(302, `/${user.username}`);
		}
	}

	return {
		user,
		editable: isCurrentUser,
		edit: url.searchParams.has('edit')
	};
};
