import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { sessions } from '$lib/db/schema/auth';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals: { getSession }, cookies }) => {
	const session = await getSession();

	if (!session) redirect(302, '/login');

	await db.delete(sessions).where(eq(sessions.id, session.id));

	cookies.delete('sessionId', { path: '/' });

	redirect(302, '/');
};
