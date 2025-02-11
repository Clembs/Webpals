import { boolean, pgTable, primaryKey, smallint, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { profiles } from './users';

export enum NotificationTypes {
	Generic = 0,
	FriendRequest = 1,
	FriendRequestAccepted = 2,
	PostLike = 3,
	PostComment = 4,
	PostReply = 5,
	PostCommentReply = 6,
	ProfileComment = 7,
	ProfileCommentReply = 8
}

export const notifications = pgTable('notifications', {
	id: uuid().notNull().primaryKey().defaultRandom(),
	profileId: uuid()
		.notNull()
		.references(() => profiles.id, { onDelete: 'cascade' }),
	createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	type: smallint('type').notNull().$type<NotificationTypes>(),
	read: boolean('read').notNull().default(false)
	// TODO: when i implement posts
	// postId: text('post_id'),
});

export const notificationsRelations = relations(notifications, ({ one, many }) => ({
	profile: one(profiles, {
		fields: [notifications.profileId],
		references: [profiles.id]
	}),
	mentionedProfiles: many(notificationsMentionedProfiles)
}));

export const notificationsMentionedProfiles = pgTable(
	'notif_mentioned',
	{
		notificationId: uuid()
			.notNull()
			.references(() => notifications.id, { onDelete: 'cascade' }),
		profileId: uuid()
			.notNull()
			.references(() => profiles.id, { onDelete: 'cascade' })
	},
	(table) => [
		primaryKey({
			columns: [table.notificationId, table.profileId]
		})
	]
);

export const notificationsMentionedProfilesRelations = relations(
	notificationsMentionedProfiles,
	({ one }) => ({
		notification: one(notifications, {
			fields: [notificationsMentionedProfiles.notificationId],
			references: [notifications.id]
		}),
		profile: one(profiles, {
			fields: [notificationsMentionedProfiles.profileId],
			references: [profiles.id]
		})
	})
);
