import { db } from '$lib/db';
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { sql } from 'drizzle-orm';
import { publicProfileQuery } from '$lib/db/schema/users';
import { mergeThemes, plainTheme } from '$lib/themes/mergeThemes';

export const load: LayoutServerLoad = async ({
	locals: { getCurrentProfile, getSession },
	params: { username },
	url
}) => {
	const currentProfile = getCurrentProfile();
	const currentUser = getSession()?.user;

	const isCurrentProfile =
		currentProfile && currentProfile.username.toLowerCase() === username.toLowerCase();

	const profile = isCurrentProfile
		? currentProfile
		: await db.query.profiles.findFirst({
				where: (profile, { eq }) => eq(sql`LOWER(${profile.username})`, username.toLowerCase()),
				with: {
					connections: true,
					initiatedRelationships: {
						with: {
							recipient: publicProfileQuery
						}
					}
				}
			});

	if (!profile) throw error(404, 'User not found');

	// if the capitalization of the username is incorrect, redirect to the correct URL
	if (username !== profile.username) {
		redirect(301, `/${profile.username}`);
	}

	if (url.searchParams.has('edit')) {
		if (!isCurrentProfile) {
			redirect(302, `/${profile.username}`);
		}
	}

	return {
		currentUser,
		profile: { ...profile, theme: mergeThemes(plainTheme, profile?.theme || {}) },
		editable: isCurrentProfile,
		editing: !!(!url.searchParams.has('view') && isCurrentProfile)
	};
};
