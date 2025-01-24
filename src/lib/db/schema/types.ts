import type { passkeys, authCodes, sessions, inviteCodes } from './auth';
import type { notifications, notificationsMentionedUsers } from './notifications';
import type { users, relationships, connections } from './users';

type User = typeof users.$inferSelect & {
	connections: Connection[];
};

export type PublicUser = Omit<User, 'challenge' | 'challengeExpiresAt' | 'email'>;

export type FullUser = User & {
	passkeys: Passkey[];
	sessions: Session[];
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

export type Passkey = typeof passkeys.$inferSelect;

export type AuthCode = typeof authCodes.$inferSelect;

export type Session = typeof sessions.$inferSelect;

export type InviteCode = typeof inviteCodes.$inferSelect;

export type Notification = typeof notifications.$inferSelect & {
	mentionedUsers: (typeof notificationsMentionedUsers.$inferSelect & {
		user: PublicUser | null;
	})[];
};
