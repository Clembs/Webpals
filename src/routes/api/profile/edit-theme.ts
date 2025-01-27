import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { parse, isValiError } from 'valibot';
import { ThemeStructure } from '$lib/themes/theme-structure';
import { db } from '$lib/db';
import { users } from '$lib/db/schema/users';
import type { Theme } from '$lib/themes/types';
import { eq } from 'drizzle-orm';
import { supabase } from '$lib/db/supabase';
import sharp from 'sharp';
import { generateSnowflake } from '$lib/helpers/users';

export async function editTheme({ locals: { getCurrentUser }, request }: RequestEvent) {
	const user = getCurrentUser();

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
			console.dir(err.issues[0].issues, {
				depth: 10
			});
		}
		return fail(400, {
			message: String(err)
		});
	}

	if (themeObject.background.type === 'image') {
		const base64String = themeObject.background.image_url;

		// upload the image to the storage
		const imageBuffer = Buffer.from(base64String.split(',')[1], 'base64');

		const loadedSharpImage = sharp(imageBuffer);

		// get the image's width & height
		const { width, height } = (await loadedSharpImage.metadata()) as {
			width: number;
			height: number;
		};

		// resize & convert image to webp
		const webpBuffer = await loadedSharpImage
			.resize({
				width: Math.min(width, 1900),
				height: Math.round((Math.min(width, 1900) / width) * height)
			})
			.webp({
				quality: 80
			})
			.toBuffer();

		// delete the previous image from storage
		if (user.theme?.background?.type === 'image' && user.theme?.background?.image_url) {
			const previousImageName = user.theme.background.image_url.split('/').pop();

			try {
				await supabase.storage.from('backgrounds').remove([`/${user.id}/${previousImageName}`]);
			} catch (e) {
				console.error(e);
				return fail(500, {
					message: 'Failed to remove previous background image'
				});
			}
		}

		try {
			// upload the new image
			const storageObject = await supabase.storage
				.from('backgrounds')
				.upload(`/${user.id}/background-${generateSnowflake()}.webp`, webpBuffer, {
					contentType: 'image/webp'
				});

			if (storageObject.error || !storageObject.data) {
				console.error(storageObject.error);
				return fail(500, {
					message: 'Failed to upload background image'
				});
			}

			const url = supabase.storage.from('backgrounds').getPublicUrl(storageObject.data.path);

			themeObject.background.image_url = url.data.publicUrl;
		} catch (e) {
			console.error(e);
			return fail(500, {
				message: 'Failed to upload background image'
			});
		}
	}

	await db
		.update(users)
		.set({
			theme: themeObject
		})
		.where(eq(users.id, user.id));

	return {};
}
