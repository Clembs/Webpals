import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { connectionProviders } from '$lib/widgets/connections';
import { db } from '$lib/db';
import { connections } from '$lib/db/schema/users';
import { eq } from 'drizzle-orm';

export async function editConnection({ locals: { getCurrentUser }, request, url }: RequestEvent) {
	const user = getCurrentUser();

	if (!user) redirect(302, '/login');

	const formData = await request.formData();
	const rawIdentifiable = formData.get('connection-identifiable')?.toString();
	const connectionId = url.searchParams.get('connection-id');

	if (!rawIdentifiable || !connectionId) {
		return fail(400, {
			message: 'Missing required fields'
		});
	}

	const connectionsWidget = user.widgets
		.find((column) => column.find((w) => w.id === 'connections'))
		?.find((w) => w.id === 'connections');

	if (!connectionsWidget) {
		return fail(400, {
			message: 'No connection widget'
		});
	}

	const connection = user.connections.find(({ id }) => id === connectionId);

	if (!connection) {
		return fail(400, {
			message: 'Invalid connection ID'
		});
	}

	const connectionProvider = connectionProviders[connection.provider];

	if (
		connectionProvider.identifiablePattern &&
		!connectionProvider.identifiablePattern.test(rawIdentifiable)
	) {
		return fail(400, {
			message: 'Invalid connection identifier'
		});
	}

	const matches = connectionProvider.identifiablePattern?.exec(rawIdentifiable);

	const identifiable = connectionProvider.identifiablePattern
		? // in case there's two different URL patterns for the same provider
			matches![1] || matches![2] || rawIdentifiable
		: rawIdentifiable;

	// if the provider needs a URL, prepend https if not already present
	const connectionUrl = connectionProvider.hasUrl
		? rawIdentifiable.startsWith('http')
			? rawIdentifiable
			: `https://${connectionProvider.identifiablePrefix ?? ''}${rawIdentifiable}`
		: undefined;

	console.log({
		...connection,
		identifiable,
		url: connectionUrl
	});

	try {
		await db
			.update(connections)
			.set({
				identifiable,
				url: connectionUrl
			})
			.where(eq(connections.id, connectionId));
	} catch (e) {
		return fail(500, { message: String(e) });
	}

	return {};
}
