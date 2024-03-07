import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateInventoryInput } from 'src/dto/inventory';

@Injectable()
export class InventoryHelperService {
  constructor(public prismaService: PrismaService) {}

  /**
   * Public method to generate updated data object for inventory update.
   * @param updateData - The input data for inventory update.
   * @returns The updated data object.
   */
  public aggregateData(updateData: UpdateInventoryInput) {
    const updatedData = {};
    if (updateData.name) {
      updatedData['name'] = updateData.name;
    }

    if (updateData.quantity !== undefined) {
      updatedData['quantity'] = updateData.quantity;
    }

    if (updateData.categoryId) {
      updatedData['category'] = { connect: { id: updateData.categoryId } };
    }

    if (updateData.subCategoryId) {
      updatedData['subCategory'] = {
        connect: { id: updateData.subCategoryId },
      };
    }

    return updatedData;
  }

  /**
   * Checks if an inventory item exists by its product ID.
   * @param productId - The product ID to check.
   * @returns A promise that resolves to a boolean indicating if the inventory item exists.
   */
  async productExists(productId: string): Promise<boolean> {
    const exists = await this.prismaService.inventory.findFirst({
      where: {
        productId,
      },
    });

    return !!exists;
  }

  /**
   * Checks if a category and subcategory combination exists.
   * @param categoryId - The category ID to check.
   * @param subCategoryId - The subcategory ID to check.
   * @returns A promise that resolves to a boolean indicating if the category and subcategory combination exists.
   */
  async categoriesExists(
    categoryId: string,
    subCategoryId: string,
  ): Promise<boolean> {
    const exists = await this.prismaService.category.findFirst({
      where: {
        id: categoryId,
        subCategories: {
          some: {
            id: subCategoryId,
          },
        },
      },
    });

    return !!exists;
  }
}
