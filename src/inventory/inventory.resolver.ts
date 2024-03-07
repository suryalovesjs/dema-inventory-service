import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  CreateInventoryInput,
  FilterInventoryInput,
  Inventory,
  InventoryPaginationInput,
  InventorySortInput,
  SearchInventoryInput,
  UpdateInventoryInput,
} from '../dto/inventory';
import { InventoryService } from './inventory.service';

/**
 * Resolver for the Inventory entity.
 */
@Resolver(Inventory)
export class InventoryResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  /**
   * Retrieves a list of inventories based on the provided search, filter, pagination, and sort parameters.
   * @param search - The search criteria for filtering inventories.
   * @param filter - The filter criteria for filtering inventories.
   * @param pagination - The pagination options for retrieving inventories.
   * @param sort - The sorting options for the retrieved inventories.
   * @returns A list of inventories that match the provided criteria.
   */
  @Query(() => [Inventory])
  async getInventories(
    @Args('search', { type: () => SearchInventoryInput, nullable: true })
    search: SearchInventoryInput,
    @Args('filter', { type: () => FilterInventoryInput, nullable: true })
    filter: FilterInventoryInput,
    @Args('pagination', {
      type: () => InventoryPaginationInput,
      nullable: true,
      defaultValue: {
        page: 1,
        pageSize: 10,
      },
    })
    pagination: InventoryPaginationInput,
    @Args('sort', { type: () => InventorySortInput, nullable: true })
    sort: InventorySortInput,
  ) {
    return this.inventoryService.findAll({ search, filter, pagination, sort });
  }

  /**
   * Creates a new inventory.
   * @param newInventory - The data for the new inventory.
   * @returns The created inventory.
   */
  @Mutation(() => Inventory)
  async createInventory(
    @Args('newInventory', { type: () => CreateInventoryInput })
    newInventory: CreateInventoryInput,
  ) {
    return await this.inventoryService.createOne(newInventory);
  }

  /**
   * Updates an existing inventory.
   * @param updateData - The data for updating the inventory.
   * @returns The updated inventory.
   */
  @Mutation(() => Inventory)
  async updateInventory(
    @Args('updateData', { type: () => UpdateInventoryInput })
    updateData: UpdateInventoryInput,
  ) {
    return await this.inventoryService.updateOne(updateData);
  }

  /**
   * Updates multiple inventories in bulk.
   * @param updateDataArray - The array of inventory data for bulk update.
   * @returns The updated inventories.
   */
  @Mutation(() => [Inventory])
  async bulkUpdateInventory(
    @Args('updateData', { type: () => [UpdateInventoryInput] })
    updateDataArray: UpdateInventoryInput[],
  ) {
    return await this.inventoryService.updateMany(updateDataArray);
  }

  /**
   * Deletes an inventory by its ID.
   * @param id - The ID of the inventory to delete.
   * @returns A boolean indicating whether the inventory was successfully deleted.
   */
  @Mutation(() => Boolean)
  async deleteInventory(@Args('id', { type: () => String }) id: string) {
    return await this.inventoryService.deleteOne(id);
  }

  /**
   * Resolver field for determining if an inventory is in stock.
   * @param inventory - The inventory object.
   * @returns A boolean indicating if the inventory is in stock.
   */
  @ResolveField('inStock', () => Boolean)
  getIsInStock(@Parent() inventory: Inventory) {
    return inventory.quantity > 0;
  }

  /**
   * Resolver field for retrieving the total number of orders for an inventory.
   * @param inventory - The inventory object.
   * @returns The total number of orders for the inventory.
   */
  @ResolveField('totalOrders', () => Int)
  totalOrders(@Parent() inventory: { _count: { orders: number } }) {
    return inventory._count.orders;
  }
}
