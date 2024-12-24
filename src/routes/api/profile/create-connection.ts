import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import { users } from '$lib/db/schema/users';
import { eq } from 'drizzle-orm';
import { connectionProvidersArray } from '$lib/widgets/connections';
import type { ConnectionsWidget } from '$lib/widgets/types';

export async function createConnection({ locals: { getCurrentUser }, request }: RequestEvent) {
	const user = await getCurrentUser();

	if (!user) redirect(302, '/login');

	const formData = await request.formData();
	const provider = formData.get('connection-provider')?.toString();
	const rawIdentifiable = formData.get('connection-identifiable')?.toString();

	if (!provider || !rawIdentifiable) {
		return fail(400, { message: 'Missing required fields' });
	}

	const knownProvider = connectionProvidersArray.find(
		({ id, name }) =>
			id.toLowerCase() === provider.toLowerCase() || name.toLowerCase() === provider.toLowerCase()
	);

	if (knownProvider) {
		if (knownProvider.matchingPattern && !knownProvider.matchingPattern.test(rawIdentifiable)) {
			return fail(400, {
				message: 'Invalid connection identifier'
			});
		}

		const matches = knownProvider.matchingPattern?.exec(rawIdentifiable);

		const identifiable = knownProvider.matchingPattern
			? // in case there's two different URL patterns for the same provider
				matches![1] || matches![2]
			: rawIdentifiable;

		// if the provider needs a URL, prepend https if not already present
		const url = knownProvider.hasUrl
			? rawIdentifiable.startsWith('http')
				? rawIdentifiable
				: `https://${rawIdentifiable}`
			: undefined;

		try {
			await db
				.update(users)
				.set({
					widgets: user.widgets.map((column) =>
						column.map((w) => {
							if (w.id === 'connections') {
								const widget = w as ConnectionsWidget;

								return {
									...w,
									connections: [
										...widget.connections,
										{
											provider: knownProvider.id,
											identifiable,
											url,
											verified: false
										}
									]
								};
							}
							return w;
						})
					)
				})
				.where(eq(users.id, user.id));
		} catch (e) {
			return fail(500, { message: String(e) });
		}
	} else {
		try {
			await db
				.update(users)
				.set({
					widgets: user.widgets.map((column) =>
						column.map((w) => {
							if (w.id === 'connections') {
								const widget = w as ConnectionsWidget;

								return {
									...w,
									connections: [
										...widget.connections,
										{
											provider,
											identifiable: rawIdentifiable,
											verified: false
										}
									]
								};
							}
							return w;
						})
					)
				})
				.where(eq(users.id, user.id));
		} catch (e) {
			return fail(500, { message: String(e) });
		}
	}

	return {};
}
