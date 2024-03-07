import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { InventoryService } from './inventory.service';
import { CreateInventoryInput } from '../dto/inventory';
import { SortOptions, SortOrder } from '../constants';
import { Category } from 'src/dto/category';

describe('InventoryService', () => {
  let service: InventoryService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryService, PrismaService],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should retrieve inventory items', async () => {
    const searchInput = {
      name: 'Item',
    };

    const filterInput = {
      category: 'Electronics',
      subCategory: 'Computers',
      inStock: true,
    };

    const paginationInput = {
      page: 1,
      pageSize: 10,
    };

    const sortInput = {
      sortBy: SortOptions.quantity,
      orderBy: SortOrder.asc,
    };

    const expectedOutput = [
      {
        productId: 'abc123',
        name: 'Item1',
        category: {
          name: 'Electronics',
        },
        subCategory: {
          name: 'Computers',
        },
        quantity: 10,
      },
    ];

    jest
      .spyOn(prisma.inventory, 'findMany')
      .mockImplementation(() => Promise.resolve(expectedOutput) as any);

    await expect(
      service.findAll({
        search: searchInput,
        filter: filterInput,
        pagination: paginationInput,
        sort: sortInput,
      }),
    ).resolves.toEqual(expectedOutput);
  });

  it('createOne should create a new inventory item', async () => {
    const newInventory: CreateInventoryInput = {
      name: 'New Item',
      quantity: 10,
      categoryId: '1234567',
      subCategoryId: '7654321',
    };

    const categoryMock: Category = {
      id: newInventory.categoryId,
      name: 'random',
      subCategories: [
        {
          id: newInventory.subCategoryId,
          name: 'something',
        },
      ],
    };

    jest
      .spyOn(prisma.category, 'findFirst')
      .mockImplementation(() => Promise.resolve(categoryMock) as any);

    jest
      .spyOn(prisma.inventory, 'create')
      .mockImplementation(() => Promise.resolve(newInventory) as any);

    await expect(service.createOne(newInventory)).resolves.toEqual(
      newInventory,
    );
  });

  it('deleteOne should delete an inventory item', async () => {
    const existingProduct = '123456';

    jest
      .spyOn(service, 'productExists')
      .mockImplementation(() => Promise.resolve(true));
    jest
      .spyOn(prisma.inventory, 'delete')
      .mockImplementation(() => Promise.resolve({}) as any);

    await expect(service.deleteOne(existingProduct)).resolves.toEqual({});
  });
});
