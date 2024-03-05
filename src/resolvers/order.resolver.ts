import { Args, Resolver } from '@nestjs/graphql';
import { Order } from './order.dto';
import { Query } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Resolver(Order)
export class OrderResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  @Query(() => [Order])
  order(
    @Args('skip', { nullable: true }) skip: number,
    @Args('take', { nullable: true }) take: number,
  ) {
    return this.prismaService.order.findMany({
      where: {},
      take: take || undefined,
      skip: skip || undefined,
    });
  }
}
