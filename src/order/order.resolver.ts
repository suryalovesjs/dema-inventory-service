import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateOrderInput, Order } from '../dto/order';
import { Query } from '@nestjs/graphql';
import { OrderService } from './order.service';

/**
 * Resolver for the Order entity.
 */
@Resolver(Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  /**
   * Retrieves a list of orders.
   * @param skip - The number of orders to skip.
   * @param take - The number of orders to take.
   * @returns A list of orders.
   */
  @Query(() => [Order])
  async getOrders(
    @Args('skip', { nullable: true }) skip: number,
    @Args('take', { nullable: true }) take: number,
  ) {
    return await this.orderService.findAll({ take, skip });
  }

  /**
   * Finds an order by orderId.
   * @param orderId - The orderId of the order to find.
   * @returns The found order.
   */
  @Query(() => [Order])
  async findOrder(@Args('orderId', { nullable: false }) orderId: string) {
    return await this.orderService.findOne({ orderId });
  }

  /**
   * Creates a new order.
   * @param orderInput - The input data for creating the order.
   * @returns The created order.
   */
  @Mutation(() => Order)
  async createOrder(@Args('orderInput') orderInput: CreateOrderInput) {
    return await this.orderService.createOne(orderInput);
  }
}
