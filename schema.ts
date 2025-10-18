import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Drizzle schema for the SQL table:
 * CREATE TABLE public.gold_price (
 *   id int4 NOT NULL DEFAULT nextval('gold_price_id_seq'::regclass),
 *   price varchar,
 *   price_time varchar,
 *   price_channel varchar,
 *   created_time timestamptz(6),
 *   updated_time timestamptz(6),
 *   price_time_type varchar,
 *   product_sku varchar,
 *   CONSTRAINT gold_price_pkey PRIMARY KEY (id)
 * )
 */

export const gold_price = pgTable('gold_price', {
	id: serial('id').primaryKey(),
	// SQL used plain VARCHAR without length — map to text in Drizzle for flexibility
	price: text('price'),
	price_time: text('price_time'),
	price_channel: text('price_channel'),
	// timestamptz columns (with timezone). Use timestamp(...) with withTimezone: true.
	created_time: timestamp('created_time', { withTimezone: true }).default(null),
	updated_time: timestamp('updated_time', { withTimezone: true }).default(null),
	price_time_type: text('price_time_type'),
	product_sku: text('product_sku'),
});

