import { pgTable, smallint, text } from 'drizzle-orm/pg-core';
import { users } from './users';
import { relations } from 'drizzle-orm';

export enum NotificationTypes {
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
	targetId: text('target_id').references(() => users.id)
	// TODO: when i implement posts
	// postId: text('post_id'),
	// commentId: text('comment_id')
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
	user: one(users, {
		fields: [notifications.userId],
		references: [users.id],
		relationName: 'notifications'
	}),
	target: one(users, {
		fields: [notifications.targetId],
		references: [users.id],
		relationName: 'targer'
	})
}));
