import { Resolver, Query } from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';
import { Category } from '../dto/category';
import { Inject } from '@nestjs/common';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  @Query(() => [Category])
  async getCategories() {
    const categories = await this.prismaService.category.findMany({
      include: {
        subCategories: true,
      },
    });

    return categories;
  }
}
