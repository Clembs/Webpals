import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import type { ConnectionsWidget } from '$lib/widgets/types';
import { db } from '$lib/db';
import { users } from '$lib/db/schema/users';
import { eq } from 'drizzle-orm';

export async function deleteConnection({ locals: { getCurrentUser }, url }: RequestEvent) {
	const user = await getCurrentUser();

	if (!user) redirect(302, '/login');

	console.log('hi');
	let connectionsWidget = user.widgets
		.find((column) => column.find((w) => w.id === 'connections'))
		?.find((w) => w.id === 'connections') as ConnectionsWidget | undefined;

	if (!connectionsWidget) {
		return fail(400, {
			message: 'Invalid widget ID.'
		});
	}

	console.log(connectionsWidget);

	const connectionIndex = parseInt(url.searchParams.get('index')!);

	console.log(connectionIndex);

	if (
		!connectionIndex ||
		isNaN(connectionIndex) ||
		!connectionsWidget.connections[connectionIndex]
	) {
		return fail(400, {
			message: 'Invalid connection index.'
		});
	}

	connectionsWidget = {
		...connectionsWidget,
		connections: connectionsWidget.connections.filter((c, i) => i !== connectionIndex)
	};

	console.log(connectionsWidget);

	await db
		.update(users)
		.set({
			widgets: user.widgets.map((column) =>
				column.map((w) => {
					if (w.id === 'connections') {
						return connectionsWidget;
					}
					return w;
				})
			)
		})
		.where(eq(users.id, user.id));

	return {};
}
