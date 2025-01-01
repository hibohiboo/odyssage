CREATE SCHEMA "odyssage";
--> statement-breakpoint
CREATE TABLE "odyssage"."scenarios" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"userId" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "odyssage"."users" (
	"id" varchar(64) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "odyssage"."scenarios" ADD CONSTRAINT "scenarios_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "odyssage"."users"("id") ON DELETE cascade ON UPDATE no action;