import type { inviteCodes } from './auth';
import type { notifications, notificationsMentionedProfiles } from './notifications';
import type { profiles, relationships, connections } from './users';

type User = typeof profiles.$inferSelect & {
	connections: Connection[];
};

export type PublicUser = Omit<User, 'challenge' | 'challengeExpiresAt' | 'email'>;

export type FullUser = User & {
	notifications: Notification[];
	initiatedRelationships: (Relationship & {
		recipient: PublicUser;
	})[];
	receivedRelationships: (Relationship & {
		user: PublicUser;
	})[];
	inviteCodes: InviteCode[];
};

export type Relationship = typeof relationships.$inferSelect;

export type Connection = typeof connections.$inferSelect;

export type InviteCode = typeof inviteCodes.$inferSelect;

export type Notification = typeof notifications.$inferSelect & {
	mentionedUsers: (typeof notificationsMentionedProfiles.$inferSelect & {
		user: PublicUser | null;
	})[];
};
