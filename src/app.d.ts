// See https://kit.svelte.dev/docs/types#app

import type { FullUser, Session } from '$lib/db/schema/users';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getSession: () => Promise<Session | null | undefined>;
			getCurrentUser: () => Promise<FullUser | null | undefined>;
		}
		interface PageData {
			currentUser: FullUser | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
