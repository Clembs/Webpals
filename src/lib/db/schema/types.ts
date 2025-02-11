import type { inviteCodes } from './auth';
import type { notifications, notificationsMentionedProfiles } from './notifications';
import type { profiles, relationships, connections } from './users';

export type Profile = typeof profiles.$inferSelect & {
	connections: Connection[];
};

export type FullProfile = Profile & {
	notifications: Notification[];
	initiatedRelationships: (Relationship & {
		recipient: Profile;
	})[];
	receivedRelationships: (Relationship & {
		user: Profile;
	})[];
	inviteCodes: InviteCode[];
};

export type Relationship = typeof relationships.$inferSelect;

export type Connection = typeof connections.$inferSelect;

export type InviteCode = typeof inviteCodes.$inferSelect;

export type Notification = typeof notifications.$inferSelect & {
	mentionedUsers: (typeof notificationsMentionedProfiles.$inferSelect & {
		user: Profile | null;
	})[];
};
