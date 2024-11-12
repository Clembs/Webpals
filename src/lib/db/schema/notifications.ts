import { boolean, pgTable, primaryKey, smallint, text } from 'drizzle-orm/pg-core';
import { users, type PublicUser } from './users';
import { relations } from 'drizzle-orm';

export enum NotificationTypes {
	Generic,
	FriendRequest,
	FriendRequestAccepted,
	PostLike,
	PostComment,
	PostReply,
	PostCommentReply,
	ProfileComment,
	ProfileCommentReply
}

export const notifications = pgTable('notifications', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	type: smallint('type').notNull().$type<NotificationTypes>(),
	read: boolean('read').notNull().default(false)
	// TODO: when i implement posts
	// postId: text('post_id'),
});

export const notificationsRelations = relations(notifications, ({ one, many }) => ({
	user: one(users, {
		fields: [notifications.userId],
		references: [users.id]
	}),
	mentionedUsers: many(notificationsMentionedUsers)
}));

export type Notification = typeof notifications.$inferSelect & {
	mentionedUsers: (typeof notificationsMentionedUsers.$inferSelect & {
		user: PublicUser | null;
	})[];
};

export const notificationsMentionedUsers = pgTable(
	'notif_mentioned',
	{
		notificationId: text('notification_id')
			.notNull()
			.references(() => notifications.id),
		userId: text('user_id')
			.notNull()
			.references(() => users.id)
	},
	({ notificationId, userId }) => ({
		id: primaryKey({
			columns: [notificationId, userId]
		})
	})
);

export const notificationsMentionedUsersRelations = relations(
	notificationsMentionedUsers,
	({ one }) => ({
		notification: one(notifications, {
			fields: [notificationsMentionedUsers.notificationId],
			references: [notifications.id]
		}),
		user: one(users, {
			fields: [notificationsMentionedUsers.userId],
			references: [users.id]
		})
	})
);
