import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Order } from 'src/dto/order';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async findAll(take, skip): Promise<Order[]> {
    return this.prismaService.order.findMany({
      where: {},
      take: take || undefined,
      skip: skip || undefined,
    });
  }
}
