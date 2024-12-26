import type { PartialTheme } from '$lib/themes/mergeThemes';
import type { AnyWidget } from '$lib/widgets/types';
import { relations } from 'drizzle-orm';
import { index, jsonb, pgTable, primaryKey, smallint, text, timestamp } from 'drizzle-orm/pg-core';
import {
	inviteCodes,
	passkeys,
	sessions,
	type InviteCode,
	type Passkey,
	type Session
} from './auth';
import { notifications, notificationsMentionedUsers, type Notification } from './notifications';
import {
	defaultAboutMeWidget,
	defaultCommentsWidget,
	defaultFriendsWidget,
	defaultMusicWidget
} from '../../widgets/default-widgets';

export const UserStatusTypes = ['online', 'dnd', 'offline'] as const;

export const users = pgTable('users', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	challenge: text('challenge'),
	challengeExpiresAt: timestamp('challenge_expires_at'),
	username: text('username').notNull().unique(),
	displayName: text('display_name'),
	avatar: text('avatar'),
	pronouns: text('pronouns'),
	lastHeartbeat: timestamp('last_heartbeat', {
		withTimezone: true
	})
		.notNull()
		.defaultNow(),
	widgets: jsonb('widgets')
		.notNull()
		.default([
			[defaultMusicWidget],
			[defaultAboutMeWidget, defaultFriendsWidget, defaultCommentsWidget]
		] as AnyWidget[][])
		.$type<AnyWidget[][]>(),
	status: text('status', {
		enum: UserStatusTypes
	})
		.notNull()
		.default('online'),
	theme: jsonb('theme').$type<PartialTheme>()
});

export const usersRelations = relations(users, ({ many }) => ({
	passkeys: many(passkeys),
	sessions: many(sessions),
	notifications: many(notifications),
	mentionedInNotifications: many(notificationsMentionedUsers),
	// Relationships can be bi-directional (for friends for example), so we need to define the relation twice
	initiatedRelationships: many(relationships, {
		relationName: 'initiated'
	}),
	receivedRelationships: many(relationships, {
		relationName: 'received'
	}),
	inviteCodes: many(inviteCodes)
}));

type User = typeof users.$inferSelect;

export type PublicUser = Omit<User, 'challenge' | 'challengeExpiresAt' | 'email'>;

export const publicUserColumns: { [K in Partial<keyof PublicUser>]: true } = {
	avatar: true,
	displayName: true,
	id: true,
	status: true,
	lastHeartbeat: true,
	pronouns: true,
	theme: true,
	username: true,
	widgets: true
} as const;

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

export enum RelationshipTypes {
	FriendPending,
	Friend,
	Blocked
}

export const relationships = pgTable(
	'relationships',
	{
		userId: text('user_id').notNull(),
		recipientId: text('recipient_id').notNull(),
		status: smallint('status').notNull().$type<RelationshipTypes>(),
		createdAt: timestamp('created_at').notNull().defaultNow()
	},
	({ userId, recipientId }) => [
		{
			id: primaryKey({
				columns: [userId, recipientId]
			})
		}
	]
);

export const relationshipsRelations = relations(relationships, ({ one }) => ({
	user: one(users, {
		fields: [relationships.userId],
		references: [users.id],
		relationName: 'initiated'
	}),
	recipient: one(users, {
		fields: [relationships.recipientId],
		references: [users.id],
		relationName: 'received'
	})
}));

export type Relationship = typeof relationships.$inferSelect;
