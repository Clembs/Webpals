import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { parse, isValiError } from 'valibot';
import { ThemeStructure } from '$lib/themes/theme-structure';
import { db } from '$lib/db';
import { users } from '$lib/db/schema/users';
import type { Theme } from '$lib/themes/types';
import { eq } from 'drizzle-orm';

export async function editTheme({ locals: { getCurrentUser }, request }: RequestEvent) {
	const user = await getCurrentUser();

	if (!user) redirect(302, '/login');

	const formData = await request.formData();
	const rawThemeString = formData.get('theme')?.toString();

	if (!rawThemeString) {
		return fail(400, {
			message: 'Invalid theme'
		});
	}

	let themeObject: Theme;

	try {
		themeObject = JSON.parse(rawThemeString);
	} catch (err) {
		console.error(err);
		return fail(400, {
			message: 'Invalid theme'
		});
	}

	// check that the widget is valid after mutation
	try {
		parse(ThemeStructure, themeObject, {
			message: 'Invalid theme'
		});
	} catch (err) {
		if (isValiError(err)) {
			console.dir(
				err.issues.map((i) => ({
					expected: i.expected,
					received: i.received,
					path: i.path
				})),
				{
					depth: 10
				}
			);
		}
		return fail(400, {
			message: String(err)
		});
	}

	await db
		.update(users)
		.set({
			theme: themeObject
		})
		.where(eq(users.id, user.id));

	return {};
}
