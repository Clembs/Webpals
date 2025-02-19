import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import { connections } from '$lib/db/schema/profiles';
import { eq } from 'drizzle-orm';

export async function deleteConnection({ locals: { getCurrentProfile }, url }: RequestEvent) {
	const user = getCurrentProfile();

	if (!user) redirect(302, '/login');

	const connectionsWidget = user.widgets
		.find((column) => column.find((w) => w.id === 'connections'))
		?.find((w) => w.id === 'connections');

	if (!connectionsWidget) {
		return fail(400, {
			message: 'No connection widget'
		});
	}

	const connectionId = url.searchParams.get('connection-id');
	const connection = user.connections.find(({ id }) => id === connectionId);

	if (!connectionId || !connection) {
		return fail(400, {
			message: 'Invalid connection ID'
		});
	}

	await db.delete(connections).where(eq(connections.id, connectionId));

	return {};
}
