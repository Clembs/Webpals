import { fail, type Actions } from '@sveltejs/kit';
import { getSpotifyToken } from '$lib/helpers/music';

export const actions: Actions = {
	async default({ request, fetch }) {
		const formData = await request.formData();
		const query = formData.get('query')?.toString();

		if (!query) return fail(400, { message: 'No query provided' });

		try {
			// anonymously fetch the Spotify search page to get a session
			const accessToken = await getSpotifyToken();

			const searchParams = new URLSearchParams();
			searchParams.append('q', query);
			searchParams.append('type', 'track');
			searchParams.append('limit', '10');

			const searchRes = await fetch(`https://api.spotify.com/v1/search?${searchParams}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}).then((r) => r.json());

			const tracks = searchRes.tracks.items;

			return tracks;
		} catch (err) {
			console.log(err);
			return fail(500, { message: `Failed to search. Error: ${err}` });
		}
	}
};
