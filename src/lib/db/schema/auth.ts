import { relations } from 'drizzle-orm';
import { pgTable, timestamp, text, uuid } from 'drizzle-orm/pg-core';
import { profiles } from './profiles';

export const inviteCodes = pgTable('invite_codes', {
	id: uuid().notNull().primaryKey().defaultRandom(),
	code: text().notNull().unique(),
	issuerId: uuid()
		.notNull()
		.references(() => profiles.id, { onDelete: 'cascade' }),
	createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	claimedAt: timestamp({ withTimezone: true }),
	claimedById: uuid().references(() => profiles.id, { onDelete: 'cascade' })
});

export const inviteCodesRelations = relations(inviteCodes, ({ one }) => ({
	issuer: one(profiles, {
		fields: [inviteCodes.issuerId],
		references: [profiles.id]
	}),
	claimedBy: one(profiles, {
		fields: [inviteCodes.claimedById],
		references: [profiles.id]
	})
}));
