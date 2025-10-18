import koa from 'koa';
import Router from '@koa/router';
import { db } from './db';
import { gold_price } from './schema';

export const app = new koa();

app.on('error', (err, ctx) => {
  console.error('Server error', err, ctx);
});

const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = 'Welcome to the Gold Price API';
});

router.get('/gold/price', async (ctx) => {
  const prices = await db.select().from(gold_price);
  ctx.body = prices.map(item => ({
    price: item.price,
    price_time: item.price_time,
    price_time_type: item.price_time_type,
  }));
});

app.use(router.routes()).use(router.allowedMethods());