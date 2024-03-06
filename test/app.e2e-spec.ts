import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { inventoryMock } from './mockData';
import { InventoryService } from '../src/inventory/inventory.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const InventoryServiceMock = {
    findAll: () => inventoryMock,
  };
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(InventoryService)
      .useValue(InventoryServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('getInventories', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: `{getInventories {productId name}}`,
      })
      .expect(({ body }) => {
        console.log('body', body);
        const data = body.data.getInventories;
        expect(data).toBeDefined();
      })
      .expect(200);
  });
});
