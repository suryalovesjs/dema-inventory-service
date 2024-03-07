import { Injectable } from '@nestjs/common';
import { SortOptions } from '../constants';
import { PrismaService } from '../prisma.service';
import {
  CreateInventoryInput,
  FilterInventoryInput,
  InventoryPaginationInput,
  InventorySortInput,
  SearchInventoryInput,
  UpdateInventoryInput,
} from 'src/dto/inventory';
import { v4 as uuidv4 } from 'uuid';
import { InventoryNotFoundException } from '../helpers/exceptions';

@Injectable()
/**
 * Service class for managing inventory.
 */
export class InventoryService {
  constructor(private prismaService: PrismaService) {}

  /**
   * Private method to generate updated data object for inventory update.
   * @param updateData - The input data for inventory update.
   * @returns The updated data object.
   */
  private _dataToUpdate(updateData: UpdateInventoryInput) {
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
  async existsById(productId: string): Promise<boolean> {
    const exists = await this.prismaService.inventory.findFirst({
      where: {
        productId,
      },
    });

    return !!exists;
  }

  /**
   * Retrieves all inventory items based on search, filter, pagination, and sort criteria.
   * @param search - The search criteria for inventory items.
   * @param filter - The filter criteria for inventory items.
   * @param pagination - The pagination criteria for retrieving inventory items.
   * @param sort - The sort criteria for retrieving inventory items.
   * @returns A promise that resolves to an array of inventory items.
   */
  async findAll({
    search,
    filter,
    pagination,
    sort,
  }: {
    search: SearchInventoryInput;
    filter: FilterInventoryInput;
    pagination: InventoryPaginationInput;
    sort: InventorySortInput;
  }) {
    const nameWhere =
      search && search.name ? { name: { contains: search.name } } : {};

    const categoryWhere =
      filter && filter.category
        ? { category: { name: { contains: filter.category } } }
        : {};

    const subCategoryWhere =
      filter && filter.subCategory
        ? { subCategory: { name: { equals: filter.subCategory } } }
        : {};

    const inStockWhere =
      filter && filter.inStock !== null
        ? { quantity: filter.inStock ? { gt: 0 } : { equals: 0 } }
        : {};

    const skip = (pagination.page - 1) * pagination.pageSize;

    const data = await this.prismaService.inventory.findMany({
      where: {
        ...inStockWhere,
        ...nameWhere,
        ...categoryWhere,
        ...subCategoryWhere,
      },
      take: pagination.pageSize,
      skip: skip,
      orderBy: {
        ...(sort && sort.sortBy === SortOptions.quantity
          ? { quantity: sort.orderBy }
          : {}),
        ...(sort && sort.sortBy === SortOptions.totalOrders
          ? { orders: { _count: sort.orderBy } }
          : {}),
      },
      include: {
        orders: true,
        category: true,
        subCategory: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    return data;
  }

  /**
   * Creates a new inventory item.
   * @param newInventory - The data for the new inventory item.
   * @returns A promise that resolves to the created inventory item.
   */
  async createOne(newInventory: CreateInventoryInput) {
    return await this.prismaService.inventory.create({
      data: {
        productId: uuidv4(),
        name: newInventory.name,
        quantity: newInventory.quantity,
        category: {
          connect: {
            id: newInventory.categoryId,
          },
        },
        subCategory: {
          connect: {
            id: newInventory.subCategoryId,
          },
        },
      },
    });
  }

  /**
   * Updates an existing inventory item.
   * @param updateData - The data for updating the inventory item.
   * @returns A promise that resolves to the updated inventory item.
   * @throws InventoryNotFoundException if the inventory item does not exist.
   */
  async updateOne(updateData: UpdateInventoryInput) {
    console.log('UpdateData', updateData);
    if (!(await this.existsById(updateData.productId))) {
      throw new InventoryNotFoundException(updateData.productId);
    }

    const updatedData = this._dataToUpdate(updateData);

    return await this.prismaService.inventory.update({
      where: { productId: updateData.productId },
      data: updatedData,
    });
  }

  /**
   * Updates multiple existing inventory items.
   * @param updateInputs - The data for updating multiple inventory items.
   * @returns A promise that resolves to an array of updated inventory items.
   * @throws InventoryNotFoundException if any of the inventory items do not exist.
   */
  async updateMany(updateInputs: UpdateInventoryInput[]) {
    const updates = updateInputs.map(async (updateData) => {
      if (!(await this.existsById(updateData.productId))) {
        throw new InventoryNotFoundException(updateData.productId);
      }

      const updatedData = this._dataToUpdate(updateData);

      return this.prismaService.inventory.update({
        where: { productId: updateData.productId },
        data: updatedData,
      });
    });

    const result = await Promise.all(updates);

    return result;
  }

  /**
   * Deletes an existing inventory item.
   * @param productId - The product ID of the inventory item to delete.
   * @returns A promise that resolves when the inventory item is deleted.
   * @throws InventoryNotFoundException if the inventory item does not exist.
   */
  async deleteOne(productId: string) {
    if (!(await this.existsById(productId))) {
      throw new InventoryNotFoundException(productId);
    }
    return this.prismaService.inventory.delete({ where: { productId } });
  }
}
