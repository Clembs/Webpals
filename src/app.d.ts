import type { Session, FullProfile } from '$lib/db/schema/types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getSession: () => Session | null | undefined;
			getCurrentUser: () => FullProfile | null | undefined;
		}
		interface PageData {
			currentUser: FullProfile | null | undefined;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
