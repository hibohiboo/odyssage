CREATE TABLE "odyssage"."scenario_stock" (
	"user_id" varchar(64) NOT NULL,
	"scenario_id" uuid NOT NULL,
	"stocked_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "scenario_stock_user_id_scenario_id_pk" PRIMARY KEY("user_id","scenario_id")
);
--> statement-breakpoint
ALTER TABLE "odyssage"."scenario_stock" ADD CONSTRAINT "scenario_stock_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "odyssage"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "odyssage"."scenario_stock" ADD CONSTRAINT "scenario_stock_scenario_id_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "odyssage"."scenarios"("id") ON DELETE cascade ON UPDATE no action;