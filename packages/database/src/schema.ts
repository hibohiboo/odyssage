import { pgSchema, uuid, text, varchar, timestamp } from 'drizzle-orm/pg-core';

export const mySchema = pgSchema('odyssage');
export const usersTable = mySchema.table('users', {
  id: varchar({ length: 64 }).primaryKey(),
  name: text('name').notNull().default(''),
});

export const scenariosTable = mySchema.table('scenarios', {
  id: uuid().primaryKey(),
  title: text('title').notNull(),
  userId: varchar('user_id', { length: 64 })
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
  overview: text('overview').notNull(),
  visibility: varchar('visibility', { length: 10 })
    .notNull()
    .default('private'),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertScenario = typeof scenariosTable.$inferInsert;
export type SelectScenario = typeof scenariosTable.$inferSelect;
