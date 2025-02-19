import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_PROJECT_URL } from '$env/static/public';
import { db } from '$lib/db';
import { publicProfileQuery } from '$lib/db/schema/profiles';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(
		PUBLIC_SUPABASE_PROJECT_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll: () => event.cookies.getAll(),
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, { ...options, path: '/' });
					});
				}
			}
		}
	);

	const { data: sessionData } = await event.locals.supabase.auth.getSession();
	const session = sessionData?.session;
	let user: User | null = null;

	if (session) {
		const { data: userData, error } = await event.locals.supabase.auth.getUser();

		if (userData && !error) {
			user = userData.user;
		}
	}
	const profile = user
		? await db.query.profiles.findFirst({
				where: ({ id }, { eq }) => eq(id, user?.id),
				with: {
					inviteCodes: true,
					connections: true,
					notifications: {
						with: {
							mentionedProfiles: {
								with: {
									profile: publicProfileQuery
								}
							}
						}
					},
					initiatedRelationships: {
						with: {
							recipient: publicProfileQuery
						}
					},
					receivedRelationships: {
						with: {
							profile: publicProfileQuery
						}
					}
				}
			})
		: null;

	event.locals.getSession = () => {
		return { session, user };
	};

	event.locals.getCurrentProfile = () => {
		return profile && { ...profile, lastHeartbeat: new Date() };
	};

	return await resolve(event);
};
