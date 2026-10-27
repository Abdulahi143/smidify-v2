import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const contentDocuments = sqliteTable('content_documents', {
 id: text('id').primaryKey(),
 body: text('body').notNull(),
 revision: integer('revision').notNull().default(0),
 updatedAt: text('updated_at').notNull(),
});
