import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import { profiles } from '$lib/db/schema/users';
import { eq } from 'drizzle-orm';
import sharp from 'sharp';
import { clientSupabase } from '$lib/db/supabase';
import { generateSnowflake } from '$lib/helpers/users';

export async function editProfile({ locals: { getCurrentProfile }, request }: RequestEvent) {
	const profile = getCurrentProfile();

	if (!profile) redirect(302, '/login');

	const formData = await request.formData();
	const displayName = formData.get('display-name')?.toString();
	const pronouns = formData.get('pronouns')?.toString();
	const avatar = formData.get('avatar') as File | null;

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

	if (avatar && !avatar.type.startsWith('image/')) {
		return fail(400, {
			message: 'Invalid avatar. Must be an image.'
		});
	}

	if (avatar && avatar.size > 1024 * 1024) {
		return fail(400, {
			message: 'Invalid avatar. Must be less than 1MB.'
		});
	}

	let avatarId = profile.avatar;

	if (avatar && avatar.size > 0 && avatar.name) {
		const resized = await sharp(await avatar.arrayBuffer())
			.resize(128, 128, {
				fit: 'cover'
			})
			.webp({
				quality: 75
			})
			.toBuffer();

		if (profile.avatar) {
			await clientSupabase.storage.from('avatars').remove([`${profile.id}/${avatarId}`]);
		}

		avatarId = generateSnowflake();

		const { error } = await clientSupabase.storage
			.from('avatars')
			.upload(`${profile.id}/${avatarId}.webp`, resized, {
				contentType: 'image/webp',
				cacheControl: 'public, max-age=31536000, immutable'
			});

		if (error) {
			console.error(error);
			return fail(500, {
				message: 'Failed to upload avatar.'
			});
		}
	}

	await db
		.update(profiles)
		.set({
			displayName,
			pronouns,
			avatar: avatarId
		})
		.where(eq(profiles.id, profile.id));

	return {};
}
