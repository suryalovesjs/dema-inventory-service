import { Module } from '@nestjs/common';
import { InventoryResolver } from './inventory.resolver';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../prisma.service';
import { CategoryResolver } from './category.resolver';

@Module({
  providers: [
    InventoryResolver,
    InventoryService,
    PrismaService,
    CategoryResolver,
  ],
})
export class InventoryModule {}
