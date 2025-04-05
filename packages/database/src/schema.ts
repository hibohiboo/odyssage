import {
  pgSchema,
  uuid,
  text,
  varchar,
  timestamp,
  primaryKey,
} from 'drizzle-orm/pg-core';

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
  overview: text('overview').notNull().default(''),
  visibility: varchar('visibility', { length: 10 })
    .notNull()
    .default('private'),
});

export const scenarioStockTable = mySchema.table(
  'scenario_stock',
  {
    userId: varchar('user_id', { length: 64 })
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    scenarioId: uuid('scenario_id')
      .notNull()
      .references(() => scenariosTable.id, { onDelete: 'cascade' }),
    stockedAt: timestamp('stocked_at').notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.scenarioId] }),
  }),
);

// セッションテーブルの定義
export const sessionsTable = mySchema.table('sessions', {
  id: uuid().primaryKey(),
  gmId: varchar('gm_id', { length: 64 })
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  scenarioId: uuid('scenario_id')
    .notNull()
    .references(() => scenariosTable.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  status: varchar('status', { length: 10 }).notNull().default('準備中'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertScenario = typeof scenariosTable.$inferInsert;
export type SelectScenario = typeof scenariosTable.$inferSelect;
export type InsertScenarioStock = typeof scenarioStockTable.$inferInsert;
export type SelectScenarioStock = typeof scenarioStockTable.$inferSelect;
export type InsertSession = typeof sessionsTable.$inferInsert;
export type SelectSession = typeof sessionsTable.$inferSelect;
