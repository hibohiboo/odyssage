import { serial, pgSchema } from 'drizzle-orm/pg-core';

export const mySchema = pgSchema('odyssage');
export const usersTable = mySchema.table('users_table', {
	id: serial('id').primaryKey(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
