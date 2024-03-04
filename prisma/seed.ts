import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function seed() {
  try {
    const ordersCsvData = fs.readFileSync('orders.csv', 'utf-8');
    const inventoryCsvData = fs.readFileSync('inventory.csv', 'utf-8');
    const ordersRows = ordersCsvData.split('\n');
    const inventoryRows = inventoryCsvData.split('\n');

    for (let i = 1; i < ordersRows.length; i++) {
      const [
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
      ] = ordersRows[i].split(',');

      const [productId, name, quantity, category, subCategory] =
        inventoryRows[i];

      // Create order
      const order = await prisma.order.create({
        data: {
          orderId,
          productId: inventoryProductId,
          currency,
          quantity: inventoryQuantity,
          shippingCost,
          amount,
          channel,
          channelGroup,
          campaign,
          dateTime,
        },
      });

      // Create inventory
      const inventory = await prisma.inventory.create({
        data: {
          productId,
          name,
          quantity,
          category,
          subCategory,
        },
      });

      console.log(`Created order: ${order.name}, inventory: ${inventory.name}`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
