import { Args, Resolver } from '@nestjs/graphql';
import { Order } from '../dto/order';
import { Query } from '@nestjs/graphql';
import { OrderService } from './order.service';

@Resolver(Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [Order])
  async getOrders(
    @Args('skip', { nullable: true }) skip: number,
    @Args('take', { nullable: true }) take: number,
  ) {
    return await this.orderService.findAll(take, skip);
  }
}
