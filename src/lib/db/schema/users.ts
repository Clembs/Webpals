import type { PartialTheme } from '$lib/themes/mergeThemes';
import { connectionProviderKeys, type AnyWidget } from '../../widgets/types';
import { eq, relations, sql } from 'drizzle-orm';
import {
	boolean,
	check,
	jsonb,
	pgEnum,
	pgPolicy,
	pgTable,
	pgView,
	primaryKey,
	smallint,
	text,
	timestamp,
	uuid,
	varchar
} from 'drizzle-orm/pg-core';
import { inviteCodes } from './auth';
import { notifications, notificationsMentionedProfiles } from './notifications';
import {
	defaultAboutMeWidget,
	defaultCommentsWidget,
	defaultFriendsWidget,
	defaultMusicWidget
} from '../../widgets/default-widgets';
import { authenticatedRole, authUid, authUsers } from 'drizzle-orm/supabase';

export const USERNAME_REGEX = /^([a-zA-Z0-9_]{2,24})$/;

export const profileStatus = pgEnum('profile_status', ['online', 'dnd', 'offline']);

export const profiles = pgTable(
	'profiles',
	{
		id: uuid()
			.notNull()
			.primaryKey()
			.references(() => authUsers.id, { onDelete: 'cascade' }),
		username: varchar({ length: 24 }).notNull().unique(),
		displayName: varchar({ length: 50 }),
		avatar: varchar({ length: 64 }),
		pronouns: varchar({ length: 16 }),
		lastHeartbeat: timestamp({ withTimezone: true }).notNull().defaultNow(),
		status: profileStatus().notNull().default('online'),
		widgets: jsonb()
			.notNull()
			.default([
				[defaultMusicWidget],
				[defaultAboutMeWidget, defaultFriendsWidget, defaultCommentsWidget]
			] as AnyWidget[][])
			.$type<AnyWidget[][]>(),
		theme: jsonb('theme').$type<PartialTheme>()
	},
	(table) => [
		check('username should fit the regex', sql`${table.username} ~ '${USERNAME_REGEX.source}'`),
		pgPolicy('users can update their own profile', {
			for: 'update',
			to: authenticatedRole,
			using: eq(table.id, authUid)
		})
	]
);

export const profilesRelations = relations(profiles, ({ many }) => ({
	notifications: many(notifications),
	connections: many(connections),
	mentionedInNotifications: many(notificationsMentionedProfiles),
	// Relationships can be bi-directional (for friends for example), so we need to define the relation twice
	initiatedRelationships: many(relationships, {
		relationName: 'initiated'
	}),
	receivedRelationships: many(relationships, {
		relationName: 'received'
	}),
	inviteCodes: many(inviteCodes)
}));

export const connections = pgTable('connections', {
	id: uuid().defaultRandom().primaryKey(),
	profileId: uuid()
		.notNull()
		.references(() => profiles.id, { onDelete: 'cascade' }),
	provider: text({ enum: connectionProviderKeys }).notNull(),
	label: varchar({ length: 64 }),
	identifiable: varchar({ length: 128 }).notNull(),
	url: text(),
	verified: boolean().notNull().default(false)
});

export const connectionsRelations = relations(connections, ({ one }) => ({
	profile: one(profiles, {
		fields: [connections.profileId],
		references: [profiles.id]
	})
}));

export const publicProfiles = pgView('public_profiles_view').as((qb) =>
	qb
		.select({
			id: profiles.id,
			username: profiles.username,
			displayName: profiles.displayName,
			avatar: profiles.avatar,
			pronouns: profiles.pronouns,
			lastHeartbeat: profiles.lastHeartbeat,
			widgets: profiles.widgets,
			status: profiles.status,
			theme: profiles.theme
		})
		.from(profiles)
		.leftJoin(connections, eq(profiles.id, connections.profileId))
);

export enum RelationshipTypes {
	FriendPending,
	Friend,
	Blocked
}

export const relationships = pgTable(
	'relationships',
	{
		profileId: uuid()
			.notNull()
			.references(() => profiles.id, { onDelete: 'cascade' }),
		recipientId: uuid()
			.notNull()
			.references(() => profiles.id, { onDelete: 'cascade' }),
		status: smallint().notNull().$type<RelationshipTypes>(),
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		primaryKey({
			columns: [table.profileId, table.recipientId]
		})
	]
);

export const relationshipsRelations = relations(relationships, ({ one }) => ({
	profile: one(profiles, {
		fields: [relationships.profileId],
		references: [profiles.id],
		relationName: 'initiated'
	}),
	recipient: one(profiles, {
		fields: [relationships.recipientId],
		references: [profiles.id],
		relationName: 'received'
	})
}));
