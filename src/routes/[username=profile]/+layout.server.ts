import { db } from '$lib/db';
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { sql } from 'drizzle-orm';
import { publicUserQuery } from '$lib/db/schema/users';
import { mergeThemes, plainTheme } from '$lib/themes/mergeThemes';

export const load: LayoutServerLoad = async ({ params: { username }, url, parent }) => {
	const user = await db.query.users.findFirst({
		where: (user, { eq }) => eq(sql`LOWER(${user.username})`, username.toLowerCase()),
		columns: {
			id: true,
			avatar: true,
			displayName: true,
			lastHeartbeat: true,
			pronouns: true,
			status: true,
			widgets: true,
			username: true,
			theme: true
		},
		with: {
			connections: true,
			initiatedRelationships: {
				with: {
					recipient: publicUserQuery
				}
			}
		}
	});

	if (!user) throw error(404, 'User not found');

	// if the capitalization of the username is incorrect, redirect to the correct URL
	if (username !== user.username) {
		redirect(301, `/${user.username}`);
	}

	const { currentUser } = await parent();
	const isCurrentUser = currentUser && currentUser.id === user.id;

	if (url.searchParams.has('edit')) {
		if (!isCurrentUser) {
			redirect(302, `/${user.username}`);
		}
	}

	return {
		user: { ...user, theme: mergeThemes(plainTheme, user?.theme || {}) },
		editable: isCurrentUser,
		editing: !!(!url.searchParams.has('view') && isCurrentUser)
	};
};
