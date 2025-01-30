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

export async function editTheme({ locals: { getCurrentUser }, request, url }: RequestEvent) {
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
			console.dir(err.issues, {
				depth: 10
			});
		}
		return fail(400, {
			message: String(err)
		});
	}

	// we get the image from the input field
	const background = formData.get('background.image') as File | null;

	// if background is set, it means the image has been changed
	if (
		themeObject.background.type === 'image' &&
		background &&
		background instanceof File &&
		background.size > 0 &&
		background.name
	) {
		if (!background.type.startsWith('image/')) {
			return fail(400, {
				message: 'Invalid image type (must be an image)'
			});
		}

		const BLOB_REGEX = new RegExp(
			`^blob:${url.origin}/[\\da-f]{8}(?:-[\\da-f]{4}){3}-[\\da-f]{12}$`
		);

		if (!BLOB_REGEX.test(themeObject.background.image_url)) {
			return fail(400, {
				message: 'Invalid image URL'
			});
		}

		const loadedSharpImage = sharp(await background.arrayBuffer());

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
	// if the background wasn't changed through the input field, we keep the previous image
	// to make sure people don't manually edit the URL :)
	else if (user.theme?.background?.type === 'image') {
		themeObject.background.image_url = user.theme.background.image_url;
	}
	await db
		.update(users)
		.set({
			theme: themeObject
		})
		.where(eq(users.id, user.id));

	return {};
}
