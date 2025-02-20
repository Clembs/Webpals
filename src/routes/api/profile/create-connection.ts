import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import { connections } from '$lib/db/schema/profiles';
import { connectionProviders } from '$lib/widgets/connections';
import type { ConnectionProvider } from '$lib/widgets/types';

export async function createConnection({ locals: { getCurrentProfile }, request }: RequestEvent) {
	const user = getCurrentProfile();

	if (!user) redirect(302, '/login');

	const formData = await request.formData();
	const rawProvider = formData.get('connection-provider')?.toString() as
		| ConnectionProvider
		| undefined;
	const rawIdentifiable = formData.get('connection-identifiable')?.toString();
	const label = formData.get('connection-label')?.toString();

	if (!rawProvider || !rawIdentifiable) {
		return fail(400, { message: 'Missing required fields' });
	}

	if (label && label.length > 30) {
		return fail(400, { message: 'Label too long' });
	}

	const connectionProvider = connectionProviders[rawProvider];

	if (!connectionProvider) {
		return fail(400, {
			message: 'Invalid connection provider'
		});
	}

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
	const url = connectionProvider.hasUrl
		? rawIdentifiable.startsWith('http')
			? rawIdentifiable
			: `https://${connectionProvider.identifiablePrefix ?? ''}${rawIdentifiable}`
		: undefined;

	try {
		await db.insert(connections).values({
			profileId: user.id,
			provider: rawProvider,
			label,
			identifiable,
			url
		});
	} catch (e) {
		return fail(500, { message: String(e) });
	}

	return {};
}
