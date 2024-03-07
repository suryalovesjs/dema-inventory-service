import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Custom exception class for inventory not found.
 */
export class InventoryNotFoundException extends HttpException {
  /**
   * Creates an instance of InventoryNotFoundException.
   * @param {string} productId - The ID of the inventory that was not found.
   */
  constructor(productId: string) {
    super(`Inventory with id ${productId} not found`, HttpStatus.NOT_FOUND);
  }
}
