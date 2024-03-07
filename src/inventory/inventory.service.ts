import { Injectable } from '@nestjs/common';
import { SortOptions, SortOrder } from '../constants';
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
import {
  CategoryInvalidException,
  InventoryNotFoundException,
} from '../helpers/exceptions';
import { InventoryHelperService } from './inventory-helper.service';

@Injectable()
/**
 * Service class for managing inventory.
 */
export class InventoryService extends InventoryHelperService {
  constructor(public prismaService: PrismaService) {
    super(prismaService);
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
          ? { quantity: sort.orderBy || SortOrder.asc }
          : {}),
        ...(sort && sort.sortBy === SortOptions.totalOrders
          ? { orders: { _count: sort.orderBy || SortOrder.asc } }
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
   * @throws CategoryInvalidException if the category or subcategory does not exist.
   */
  async createOne(newInventory: CreateInventoryInput) {
    if (
      !(await this.categoriesExists(
        newInventory.categoryId,
        newInventory.subCategoryId,
      ))
    ) {
      throw new CategoryInvalidException();
    }
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
      include: {
        category: true,
        subCategory: true,
      },
    });
  }

  /**
   * Updates an existing inventory item.
   * @param updateData - The data for updating the inventory item.
   * @returns A promise that resolves to the updated inventory item.
   * @throws InventoryNotFoundException if the inventory item does not exist.
   * @throws CategoryInvalidException if the category or subcategory does not exist.
   */
  async updateOne(updateData: UpdateInventoryInput) {
    if (!(await this.productExists(updateData.productId))) {
      throw new InventoryNotFoundException(updateData.productId);
    }

    if (
      !(await this.categoriesExists(
        updateData.categoryId,
        updateData.subCategoryId,
      ))
    ) {
      throw new CategoryInvalidException();
    }

    const updatedData = this.aggregateData(updateData);

    return await this.prismaService.inventory.update({
      where: { productId: updateData.productId },
      data: updatedData,
      include: {
        category: true,
        subCategory: true,
      },
    });
  }

  /**
   * Updates multiple existing inventory items.
   * @param updateInputs - The data for updating multiple inventory items.
   * @returns A promise that resolves to an array of updated inventory items.
   * @throws InventoryNotFoundException if any of the inventory items do not exist.
   * @throws CategoryInvalidException if any of the categories or subcategories do not exist.
   */
  async updateMany(updateInputs: UpdateInventoryInput[]) {
    const updates = updateInputs.map(async (updateData) => {
      if (!(await this.productExists(updateData.productId))) {
        throw new InventoryNotFoundException(updateData.productId);
      }

      if (
        !(await this.categoriesExists(
          updateData.categoryId,
          updateData.subCategoryId,
        ))
      ) {
        throw new CategoryInvalidException();
      }

      const updatedData = this.aggregateData(updateData);

      return this.prismaService.inventory.update({
        where: { productId: updateData.productId },
        data: updatedData,
        include: {
          category: true,
          subCategory: true,
        },
      });
    });

    const result = await Promise.all(updates);

    return result;
  }
}
