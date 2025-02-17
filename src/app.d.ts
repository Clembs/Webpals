import type { FullProfile } from '$lib/db/schema/types';
import type { SupabaseClient, User } from '@supabase/supabase-js';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			getSession: () => {
				session: Session | null;
				user: User | null;
			};
			getCurrentProfile: () => FullProfile | null | undefined;
			session:
				| (Session & {
						user: User | null;
				  })
				| null;
			currentProfile: FullProfile | null | undefined;
		}
		interface PageData {
			currentProfile: FullProfile | null | undefined;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
