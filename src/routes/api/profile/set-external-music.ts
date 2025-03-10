import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import { profiles } from '$lib/db/schema/profiles';
import { eq } from 'drizzle-orm';
import { getSpotifyToken, type Track } from '$lib/helpers/music';

export async function setExternalMusic({ locals: { getCurrentProfile }, url }: RequestEvent) {
	const user = await getCurrentProfile();

	if (!user) redirect(302, '/login');

	const provider = url.searchParams.get('provider');
	const trackId = url.searchParams.get('track-id');

	if (!provider || !trackId || provider !== 'spotify') {
		return fail(400, {
			message: 'Invalid provider or track ID.'
		});
	}

	const accessToken = await getSpotifyToken();

	const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (!res.ok) {
		return fail(400, {
			message: 'Invalid track ID.'
		});
	}

	const track: Track = await res.json();

	if (!track) {
		return fail(400, {
			message: 'Invalid track ID.'
		});
	}

	await db
		.update(profiles)
		.set({
			widgets: user.widgets.map((column) =>
				column.map((w) => {
					if (w.id === 'music') {
						return {
							...w,
							album_art_url: track.album.images[0].url,
							content_url: track.preview_url,
							provider: 'spotify',
							title: track.name,
							artist: track.artists.map((a) => a.name).join(', '),
							external_url: track.external_urls.spotify
						};
					}
					return w;
				})
			)
		})
		.where(eq(profiles.id, user.id));

	return {};
}
