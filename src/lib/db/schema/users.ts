import type { PartialTheme } from '$lib/themes/mergeThemes';
import {
	connectionProviderKeys,
	type AnyWidget,
	type ConnectionProvider
} from '../../widgets/types';
import { relations, sql } from 'drizzle-orm';
import {
	boolean,
	jsonb,
	pgTable,
	primaryKey,
	smallint,
	text,
	timestamp
} from 'drizzle-orm/pg-core';
import { inviteCodes, passkeys, sessions } from './auth';
import { notifications, notificationsMentionedUsers } from './notifications';
import {
	defaultAboutMeWidget,
	defaultCommentsWidget,
	defaultFriendsWidget,
	defaultMusicWidget
} from '../../widgets/default-widgets';
import type { PublicUser } from './types';

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
	connections: many(connections),
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

export const publicUserQuery = {
	columns: {
		id: true,
		username: true,
		displayName: true,
		avatar: true,
		pronouns: true,
		lastHeartbeat: true,
		widgets: true,
		status: true,
		theme: true
	},
	with: {
		connections: true
	}
} as const satisfies {
	columns: { [key in keyof PublicUser]?: true };
	with: Record<string, true>;
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

export const connections = pgTable('connections', {
	id: text('id')
		.default(sql`gen_random_uuid()`)
		.primaryKey(),
	userId: text('user_id').notNull(),
	provider: text('provider', {
		enum: connectionProviderKeys
	})
		.$type<ConnectionProvider>()
		.notNull(),
	label: text('label'),
	identifiable: text('identifiable').notNull(),
	url: text('url'),
	verified: boolean('verified').default(false).notNull()
});

export const connectionsRelations = relations(connections, ({ one }) => ({
	user: one(users, {
		fields: [connections.userId],
		references: [users.id]
	})
}));
