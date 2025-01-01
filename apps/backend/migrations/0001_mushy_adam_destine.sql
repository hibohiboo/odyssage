CREATE SCHEMA "odyssage";
--> statement-breakpoint
CREATE TABLE "odyssage"."users_table" (
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
DROP TABLE "users_table" CASCADE;