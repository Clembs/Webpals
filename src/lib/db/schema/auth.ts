import { relations, sql } from 'drizzle-orm';
import { pgTable, timestamp, text, integer } from 'drizzle-orm/pg-core';
import { users } from './users';

export const passkeys = pgTable('passkeys', {
	credentialId: text('credential_id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	publicKey: text('public_key').notNull(),
	counter: integer('counter').notNull(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const passkeysRelations = relations(passkeys, ({ one }) => ({
	user: one(users, {
		fields: [passkeys.userId],
		references: [users.id]
	})
}));

export const authCodes = pgTable('auth_codes', {
	id: text('id')
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	code: text('code').notNull(),
	email: text('email').notNull(),
	expiresAt: timestamp('expires_at').notNull()
});

export const sessions = pgTable('sessions', {
	id: text('id')
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	name: text('name').notNull(),
	deviceType: text('device_type', {
		enum: ['desktop', 'mobile', 'other']
	}).notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	expiresAt: timestamp('expires_at').notNull()
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export const inviteCodes = pgTable('invite_codes', {
	id: text('id')
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	status: text('status', {
		enum: ['available', 'claimed']
	})
		.notNull()
		.default('available'),
	code: text('code').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const inviteCodesRelations = relations(inviteCodes, ({ one }) => ({
	user: one(users, {
		fields: [inviteCodes.userId],
		references: [users.id]
	})
}));
