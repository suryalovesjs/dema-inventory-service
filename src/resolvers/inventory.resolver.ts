import { PrismaService } from 'src/prisma.service';
import { Inventory } from './inventory.dto';
import { Inject } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver(Inventory)
export class InventoryResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  @Query(() => [Inventory])
  async inventory(
    @Args('searchString', { nullable: true }) searchString: string,
    @Args('page', { nullable: true }) page: number = 1,
    @Args('pageSize', { nullable: true }) pageSize: number = 5,
  ) {
    const or = searchString
      ? {
          OR: [
            { name: { contains: searchString } },
            { category: { contains: searchString } },
          ],
        }
      : {};

    const skip = (page - 1) * pageSize;

    const data = await this.prismaService.inventory.findMany({
      where: {
        ...or,
      },
      take: pageSize,
      skip: skip,
      include: { orders: true },
    });

    return data;
  }
}
