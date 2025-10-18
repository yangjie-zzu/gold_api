import nodeCron from "node-cron";
import { updateDailyPrice, updateLastPrice } from "./gold";

nodeCron.schedule("*/1 * * * *", updateLastPrice);
console.log("Scheduled task to update last price every minute.");
nodeCron.schedule("0 0 * * *", updateDailyPrice);
console.log("Scheduled task to update daily price every day at midnight.");