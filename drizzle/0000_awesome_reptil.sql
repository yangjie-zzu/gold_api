CREATE TABLE "gold_price" (
	"id" serial PRIMARY KEY NOT NULL,
	"price" text,
	"price_time" text,
	"price_channel" text,
	"created_time" timestamp with time zone DEFAULT null,
	"updated_time" timestamp with time zone DEFAULT null,
	"price_time_type" text,
	"product_sku" text
);
