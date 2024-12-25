import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import { users } from '$lib/db/schema/users';
import { eq } from 'drizzle-orm';
import { getSpotifyToken, type SpotifyTrack } from '$lib/helpers/music';

export async function editMusic({ locals: { getCurrentUser }, url }: RequestEvent) {
	const user = await getCurrentUser();

	if (!user) redirect(302, '/login');

	const contentType = url.searchParams.get('content-type');
	const trackId = url.searchParams.get('track-id');

	if (!contentType || !trackId || contentType !== 'spotify') {
		return fail(400, {
			message: 'Invalid content type or track ID.'
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

	const track: SpotifyTrack = await res.json();

	if (!track) {
		return fail(400, {
			message: 'Invalid track ID.'
		});
	}

	const [newUser] = await db
		.update(users)
		.set({
			widgets: user.widgets.map((column) =>
				column.map((w) => {
					if (w.id === 'music') {
						return {
							...w,
							album_art_url: track.album.images[0].url,
							content_url: track.preview_url,
							content_type: 'spotify',
							title: track.name,
							artist: track.artists.map((a) => a.name).join(', '),
							external_url: track.external_urls.spotify
						};
					}
					return w;
				})
			)
		})
		.where(eq(users.id, user.id))
		.returning();

	console.log(newUser);

	return {};
}
