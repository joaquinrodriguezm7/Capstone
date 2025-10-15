CREATE TABLE "comuna" (
	"id_comuna" serial PRIMARY KEY NOT NULL,
	"id_region" integer NOT NULL,
	"comuna" varchar(80) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "housing_photos" (
	"id_housing_photos" serial PRIMARY KEY NOT NULL,
	"id_housing" integer NOT NULL,
	"photo_url" varchar(200) NOT NULL,
	"is_main" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "housing" (
	"id_housing" serial PRIMARY KEY NOT NULL,
	"id_user" integer NOT NULL,
	"address" varchar(200) NOT NULL,
	"city" varchar(100) NOT NULL,
	"rent" integer NOT NULL,
	"size" integer NOT NULL,
	"available_room" integer NOT NULL,
	"pets_allowed" boolean NOT NULL,
	"smoking_allowed" boolean NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "preference" (
	"id_preferences" serial PRIMARY KEY NOT NULL,
	"owner_id" integer NOT NULL,
	"preferred_gender" varchar(10) NOT NULL,
	"min_age" integer,
	"max_age" integer,
	"min_rent" integer NOT NULL,
	"max_rent" integer NOT NULL,
	"min_km_radius" integer DEFAULT 1 NOT NULL,
	"max_km_radius" integer DEFAULT 180 NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id_profile" serial PRIMARY KEY NOT NULL,
	"id_user" integer NOT NULL,
	"description" varchar(100),
	"smoker" varchar(25),
	"drinker" varchar(25),
	"pets" integer,
	"lifestyle_schedule" varchar(25),
	"occupation" varchar(30),
	"sociability" varchar(25),
	"id_comuna" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "region" (
	"id_region" serial PRIMARY KEY NOT NULL,
	"region" varchar(80) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_photos" (
	"id_user_photos" serial PRIMARY KEY NOT NULL,
	"id_user" integer NOT NULL,
	"photo_key" varchar(200) NOT NULL,
	"is_main" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id_user" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_id_user_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"name" varchar(100),
	"age" integer,
	"gender" varchar(10),
	"phone_number" varchar(11),
	"user_type" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE "user_type" (
	"id_user_type" serial PRIMARY KEY NOT NULL,
	"type" varchar(20) NOT NULL,
	CONSTRAINT "user_type_type_unique" UNIQUE("type")
);
--> statement-breakpoint
ALTER TABLE "comuna" ADD CONSTRAINT "comuna_id_region_region_id_region_fk" FOREIGN KEY ("id_region") REFERENCES "public"."region"("id_region") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "housing_photos" ADD CONSTRAINT "housing_photos_id_housing_housing_id_housing_fk" FOREIGN KEY ("id_housing") REFERENCES "public"."housing"("id_housing") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "housing" ADD CONSTRAINT "housing_id_user_user_id_user_fk" FOREIGN KEY ("id_user") REFERENCES "public"."user"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preference" ADD CONSTRAINT "preference_owner_id_user_id_user_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_id_user_user_id_user_fk" FOREIGN KEY ("id_user") REFERENCES "public"."user"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_id_comuna_comuna_id_comuna_fk" FOREIGN KEY ("id_comuna") REFERENCES "public"."comuna"("id_comuna") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_photos" ADD CONSTRAINT "user_photos_id_user_user_id_user_fk" FOREIGN KEY ("id_user") REFERENCES "public"."user"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_user_type_user_type_type_fk" FOREIGN KEY ("user_type") REFERENCES "public"."user_type"("type") ON DELETE no action ON UPDATE no action;