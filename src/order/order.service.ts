import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Order } from 'src/dto/order';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async findAll(take, skip): Promise<Order[]> {
    return this.prismaService.order.findMany({
      where: {},
      take,
      skip,
    });
  }

  async createOne(createOrderInput): Promise<Order> {
    return await this.prismaService.order.create({
      data: createOrderInput,
    });
  }

  // async deleteOne(orderId: string) {
  //   return await this.prismaService.order.delete({
  //     where: { orderId },
  //   });
  // }
}
