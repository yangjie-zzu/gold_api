import { db } from './db';
import { gold_price } from './schema';
import { eq, and } from 'drizzle-orm';
import { desc } from 'drizzle-orm/sql/expressions';

export const updateLastPrice = async (): Promise<void> => {
  console.log('DATABASE_URL:', process.env.DATABASE_URL);

  const res = await fetch('https://ms.jr.jd.com/gw/generic/hj/h5/m/latestPrice?reqData={}', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; DrizzleClient/1.0)',
      Accept: 'application/json, text/plain, */*',
    },
  });

  const price: { price: string; productSku: string; time: string } = (await res.json())?.resultData?.datas;
  if (!price) {
    console.log('No price data from JD');
    return;
  }

  const existing = await db
    .select()
    .from(gold_price)
    .where(and(
      eq(gold_price.price_channel, 'jd'),
      eq(gold_price.price_time, price.time),
      eq(gold_price.price_time_type, 'last')
    ))
    .limit(1);

  const id = existing[0]?.id;

  if (id == null) {
    await db.insert(gold_price).values({
      price: price.price,
      product_sku: price.productSku,
      price_time: price.time,
      price_time_type: 'last',
      price_channel: 'jd',
      created_time: new Date(),
      updated_time: new Date(),
    });
    console.log('Inserted new latest price record');
  } else {
    await db
      .update(gold_price)
      .set({
        price: price.price,
        product_sku: price.productSku,
        updated_time: new Date(),
      })
      .where(eq(gold_price.id, id));
    console.log('Updated existing latest price record');
  }
};

export const updateDailyPrice = async (): Promise<void> => {
  const res = await fetch('https://ms.jr.jd.com/gw/generic/hj/h5/m/historyPrices?reqData={"period":"y"}', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; DrizzleClient/1.0)',
      Accept: 'application/json, text/plain, */*',
    },
  });

  const prices: { demode?: boolean; price: string; time: string }[] = (await res.json())?.resultData?.datas || [];

  const latestRows = await db
    .select()
    .from(gold_price)
    .where(and(
      eq(gold_price.price_channel, 'jd'),
      eq(gold_price.price_time_type, 'date')
    ))
    .orderBy(desc(gold_price.price_time))
    .limit(1);

  const newPrice = latestRows[0];

  const toInsert = prices
    .filter((item) => newPrice?.price_time == null || parseInt(item.time) > parseInt(newPrice.price_time))
    .map((p) => ({
      price: p.price,
      price_time: p.time,
      price_time_type: 'date',
      price_channel: 'jd',
      created_time: new Date(),
      updated_time: new Date(),
    }));

  let insertedCount = 0;
  if (toInsert.length > 0) {
    const inserted = await db.insert(gold_price).values(toInsert).onConflictDoNothing().returning();
    insertedCount = Array.isArray(inserted) ? inserted.length : 0;
  }

  console.log(`Fetched ${prices.length} prices, inserted ${insertedCount} new prices`);
};

