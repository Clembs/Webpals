import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import { profiles } from '$lib/db/schema/users';
import { eq } from 'drizzle-orm';

export async function editProfile({ locals: { getCurrentProfile }, request }: RequestEvent) {
	const profile = getCurrentProfile();

	if (!profile) redirect(302, '/login');

	const formData = await request.formData();
	const displayName = formData.get('display-name')?.toString();
	const pronouns = formData.get('pronouns')?.toString();

	if (!displayName || displayName.length >= 50) {
		return fail(400, {
			message: 'Invalid display name or exceeds 50 characters.'
		});
	}

	if (pronouns && pronouns.length >= 16) {
		return fail(400, {
			message: 'Invalid pronouns or exceeds 16 characters.'
		});
	}

	await db
		.update(profiles)
		.set({
			displayName,
			pronouns
		})
		.where(eq(profiles.id, profile.id));

	return {};
}
