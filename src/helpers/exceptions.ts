import { HttpException, HttpStatus } from '@nestjs/common';

export class InventoryNotFoundException extends HttpException {
  constructor(productId: string) {
    super(`Inventory with id ${productId} not found`, HttpStatus.NOT_FOUND);
  }
}
