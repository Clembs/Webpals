import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import { profiles } from '$lib/db/schema/profiles';
import { eq } from 'drizzle-orm';

export async function editAboutMe({ locals: { getCurrentProfile }, request }: RequestEvent) {
	const user = await getCurrentProfile();

	if (!user) redirect(302, '/login');

	const formData = await request.formData();
	const content = formData.get('content')?.toString();

	if (!content || content.length >= 3000) {
		return fail(400, {
			message: 'Invalid about me or exceeds 3000 characters.'
		});
	}

	await db
		.update(profiles)
		.set({
			widgets: user.widgets.map((column) =>
				column.map((w) => {
					if (w.id === 'about_me') {
						return {
							...w,
							content
						};
					}
					return w;
				})
			)
		})
		.where(eq(profiles.id, user.id));

	return {};
}
