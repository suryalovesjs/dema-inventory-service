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

@Resolver(Inventory)
export class InventoryResolver {
  constructor(private readonly inventoryService: InventoryService) {}

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

  @Mutation(() => Inventory)
  async createInventory(
    @Args('newInventory', { type: () => CreateInventoryInput })
    newInventory: CreateInventoryInput,
  ) {
    return await this.inventoryService.createOne(newInventory);
  }

  @Mutation(() => Inventory)
  async updateInventory(
    @Args('updateData', { type: () => UpdateInventoryInput })
    updateData: UpdateInventoryInput,
  ) {
    return await this.inventoryService.updateOne(updateData);
  }

  @Mutation(() => [Inventory])
  async bulkUpdateInventory(
    @Args('updateData', { type: () => [UpdateInventoryInput] })
    updateDataArray: UpdateInventoryInput[],
  ) {
    return await this.inventoryService.updateMany(updateDataArray);
  }

  @Mutation(() => Boolean)
  async deleteInventory(@Args('id', { type: () => String }) id: string) {
    return await this.inventoryService.deleteOne(id);
  }

  @ResolveField('inStock', () => Boolean)
  getIsInStock(@Parent() inventory: Inventory) {
    return inventory.quantity > 0;
  }

  @ResolveField('totalOrders', () => Int)
  totalOrders(@Parent() inventory: { _count: { orders: number } }) {
    return inventory._count.orders;
  }
}
