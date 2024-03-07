import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderInput, Order } from '../dto/order';
import { v4 as uuidv4 } from 'uuid';
import { DataNotFoundException } from '../helpers/exceptions';

@Injectable()
/**
 * Service class for managing orders.
 */
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  /**
   * Retrieves all orders.
   * @param {number} take - The number of orders to retrieve.
   * @param {number} skip - The number of orders to skip.
   * @returns {Promise<Order[]>} - A promise that resolves to an array of orders.
   */
  async findAll({
    take,
    skip,
  }: {
    take: number;
    skip: number;
  }): Promise<Order[]> {
    return this.prismaService.order.findMany({
      take,
      skip,
    });
  }

  /**
   * Retrieves a single order by orderId.
   * @param {string} orderId - The ID of the order to retrieve.
   * @returns {Promise<Order>} - A promise that resolves to the retrieved order.
   */
  async findOne({ orderId }: { orderId: string }): Promise<Order> {
    const order = await this.prismaService.order.findFirst({
      where: { orderId },
    });

    if (!order) {
      throw new DataNotFoundException();
    }

    return order;
  }

  /**
   * Creates a new order.
   * @param {CreateOrderInput} createOrderInput - The input data for creating the order.
   * @returns {Promise<Order>} - A promise that resolves to the created order.
   */
  async createOne(createOrderInput: CreateOrderInput): Promise<Order> {
    return await this.prismaService.order.create({
      data: {
        orderId: uuidv4(),
        ...createOrderInput,
      },
    });
  }
}
