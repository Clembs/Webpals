import type { Session, FullUser } from '$lib/db/schema/types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getSession: () => Session | null | undefined;
			getCurrentUser: () => FullUser | null | undefined;
		}
		interface PageData {
			currentUser: FullUser | null | undefined;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
