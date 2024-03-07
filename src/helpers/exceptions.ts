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

/**
 * Represents an exception that is thrown when the category or subcategory is invalid or there's a mismatch between them.
 */
export class CategoryInvalidException extends HttpException {
  constructor() {
    super(
      `Category or Subcategory is invalid or there's a mismatch between them`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
