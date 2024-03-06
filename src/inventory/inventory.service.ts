import { Injectable } from '@nestjs/common';
import { SortOptions } from 'src/constants';
import { PrismaService } from 'src/prisma.service';
import {
  CreateInventoryInput,
  FilterInventoryInput,
  InventoryPaginationInput,
  InventorySortInput,
  SearchInventoryInput,
  UpdateInventoryInput,
} from 'src/dto/inventory';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InventoryService {
  constructor(private prismaService: PrismaService) {}

  private async existsById(productId: string): Promise<boolean> {
    const exists = await this.prismaService.inventory.findFirst({
      where: {
        productId,
      },
    });

    return !!exists;
  }

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

  async updateOne(id: string, updateData: UpdateInventoryInput) {
    if (!(await this.existsById(id))) {
      throw new Error('Inventory not found');
    }

    const updatedData = {};

    if (updateData.name) {
      updatedData['name'] = updateData.name;
    }

    if (updateData.quantity) {
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

    return await this.prismaService.inventory.update({
      where: { productId: id },
      data: updatedData,
    });
  }
}
