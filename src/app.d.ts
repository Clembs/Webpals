// See https://kit.svelte.dev/docs/types#app

import type { Session } from '$lib/db/schema/auth';
import type { FullUser } from '$lib/db/schema/users';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getSession: () => Promise<Session | null | undefined>;
			getCurrentUser: () => Promise<FullUser | null | undefined>;
		}
		interface PageData {
			currentUser: FullUser | null | undefined;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
