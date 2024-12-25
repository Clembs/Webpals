import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	async default({ request, fetch }) {
		const formData = await request.formData();
		const query = formData.get('query')?.toString();

		if (!query) return fail(400, { message: 'No query provided' });

		try {
			// anonymously fetch the Spotify search page to get a session
			const re =
				/<script id="session" data-testid="session" type="application\/json"[^>]*>(.*?)<\/script>/;
			const sessionRes = await fetch('https://open.spotify.com/search')
				.then((res) => res.text())
				.then((str) => {
					console.log(str.match(re));
					return str.match(re)![1];
				})
				.then((json) => JSON.parse(json));

			const searchParams = new URLSearchParams();
			searchParams.append('q', query);
			searchParams.append('type', 'track');
			searchParams.append('limit', '5');

			const searchRes = await fetch(`https://api.spotify.com/v1/search?${searchParams}`, {
				headers: {
					Authorization: `Bearer ${sessionRes.accessToken}`
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
