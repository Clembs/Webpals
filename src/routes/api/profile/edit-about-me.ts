import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import { users } from '$lib/db/schema/users';

export async function editAboutMe({ locals: { getCurrentUser }, request }: RequestEvent) {
	const user = await getCurrentUser();

	if (!user) redirect(302, '/login');

	const formData = await request.formData();
	const content = formData.get('content')?.toString();

	if (!content || content.length >= 3000) {
		return fail(400, {
			message: 'Invalid about me or exceeds 3000 characters.'
		});
	}

	await db.update(users).set({
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
	});

	return {};
}
