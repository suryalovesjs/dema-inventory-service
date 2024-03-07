import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { OrderService } from './order.service';
import { CreateOrderInput } from '../dto/order';

describe('OrderService', () => {
  let service: OrderService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService, PrismaService],
    }).compile();

    service = module.get<OrderService>(OrderService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should retrieve orders', async () => {
    const expectedOutput = [
      {
        orderId: 'abc123',
        currency: 'USD',
        quantity: 1,
        shippingCost: 10,
        amount: 100,
        channel: 'Online',
        channelGroup: 'Webstore',
        campaign: 'Campaign1',
        dateTime: new Date(),
      },
    ];

    jest
      .spyOn(prisma.order, 'findMany')
      .mockImplementation(() => Promise.resolve(expectedOutput) as any);

    await expect(service.findAll({ take: 10, skip: 0 })).resolves.toEqual(
      expectedOutput,
    );
  });

  it('findOne should retrieve a single order by orderId', async () => {
    const orderId = 'abc123';

    const expectedOutput = {
      orderId: 'abc123',
      currency: 'USD',
      quantity: 1,
      shippingCost: 10,
      amount: 100,
      channel: 'Online',
      channelGroup: 'Webstore',
      campaign: 'Campaign1',
      dateTime: new Date(),
    };

    jest
      .spyOn(prisma.order, 'findFirst')
      .mockImplementation(() => Promise.resolve(expectedOutput) as any);

    await expect(service.findOne({ orderId })).resolves.toEqual(expectedOutput);
  });

  it('createOne should create a new order', async () => {
    const newOrder: CreateOrderInput = {
      productId: 'prod1',
      currency: 'USD',
      quantity: 3,
      shippingCost: 30,
      amount: 300,
      channel: 'Online',
      channelGroup: 'Webstore',
      campaign: 'Campaign1',
      dateTime: new Date(),
    };

    jest
      .spyOn(prisma.order, 'create')
      .mockImplementation(
        () => Promise.resolve({ orderId: 'abc124', ...newOrder }) as any,
      );

    await expect(service.createOne(newOrder)).resolves.toEqual({
      orderId: 'abc124',
      ...newOrder,
    });
  });
});
