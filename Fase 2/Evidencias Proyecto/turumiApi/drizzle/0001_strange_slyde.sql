CREATE TYPE "public"."match_status" AS ENUM('pending', 'matched');--> statement-breakpoint
CREATE TABLE "match" (
	"id" serial PRIMARY KEY NOT NULL,
	"from_id_user" integer NOT NULL,
	"to_id_user" integer NOT NULL,
	"match_status" "match_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"matchedAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "preference" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "preference" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_from_id_user_user_id_user_fk" FOREIGN KEY ("from_id_user") REFERENCES "public"."user"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_to_id_user_user_id_user_fk" FOREIGN KEY ("to_id_user") REFERENCES "public"."user"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_id_user_unique" UNIQUE("id_user");