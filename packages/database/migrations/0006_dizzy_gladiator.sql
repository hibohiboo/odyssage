CREATE TABLE "odyssage"."sessions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"gm_id" varchar(64) NOT NULL,
	"scenario_id" uuid NOT NULL,
	"title" text NOT NULL,
	"status" varchar(10) DEFAULT '未開始' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "odyssage"."sessions" ADD CONSTRAINT "sessions_gm_id_users_id_fk" FOREIGN KEY ("gm_id") REFERENCES "odyssage"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "odyssage"."sessions" ADD CONSTRAINT "sessions_scenario_id_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "odyssage"."scenarios"("id") ON DELETE cascade ON UPDATE no action;