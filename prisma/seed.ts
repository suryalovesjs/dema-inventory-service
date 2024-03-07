import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

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

    const categories = new Map();
    const subCategories = new Map();

    for (const [, , , category, subCategory] of inventoryData) {
      if (!categories.has(category)) {
        const newCategory = await prisma.category.create({
          data: {
            id: uuidv4(),
            name: category,
          },
        });
        categories.set(category, newCategory.id);
      }

      if (!subCategories.has(subCategory)) {
        const newSubCategory = await prisma.subCategory.create({
          data: {
            id: uuidv4(),
            name: subCategory,
            categoryId: categories.get(category),
          },
        });
        subCategories.set(subCategory, newSubCategory.id);
      }
    }

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
          category: {
            connect: {
              id: categories.get(category),
            },
          },
          subCategory: {
            connect: {
              id: subCategories.get(subCategory),
            },
          },
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
