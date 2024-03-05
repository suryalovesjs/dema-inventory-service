import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Helper function to parse CSV data
function parseCSVData(data: string) {
  return data
    .split('\n')
    .slice(1)
    .map((row) => row.split(','));
}

async function main() {
  console.log(`Start seeding ...`);
  try {
    const ordersDataFile = path.join(__dirname, 'orders.csv');
    const inventoriesDataFile = path.join(__dirname, 'inventory.csv');
    const ordersCsvData = fs.readFileSync(ordersDataFile, 'utf-8');
    const inventoryCsvData = fs.readFileSync(inventoriesDataFile, 'utf-8');

    const ordersData = parseCSVData(ordersCsvData);
    const inventoryData = parseCSVData(inventoryCsvData);

    for (const [
      productId,
      name,
      quantity,
      category,
      subCategory,
    ] of inventoryData) {
      await prisma.inventory.create({
        data: {
          productId,
          name,
          quantity: parseInt(quantity),
          category,
          subCategory,
        },
      });
    }

    for (const [
      orderId,
      inventoryProductId,
      currency,
      inventoryQuantity,
      shippingCost,
      amount,
      channel,
      channelGroup,
      campaign,
      dateTime,
    ] of ordersData) {
      await prisma.order.create({
        data: {
          orderId,
          productId: inventoryProductId,
          currency,
          quantity: parseInt(inventoryQuantity),
          shippingCost: parseFloat(shippingCost),
          amount: parseFloat(amount),
          channel,
          channelGroup,
          campaign,
          dateTime: new Date(dateTime),
        },
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
