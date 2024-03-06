export const categoryMock = [
  {
    id: 'CAT001',
    name: 'Clothes',
  },
];

export const subCategoryMock = [
  {
    id: 'SCAT001',
    name: 'Women Clothing',
    categoryId: 'CAT001',
  },
  {
    id: 'SCAT002',
    name: 'Men Clothing',
    categoryId: 'CAT001',
  },
];

export const inventoryMock = [
  {
    productId: 'PRD001',
    name: 'Women Dress',
    quantity: 120,
    categoryId: 'CAT001',
    subCategoryId: 'SCAT001',
  },
  {
    productId: 'PRD002',
    name: 'Men T-shirt',
    quantity: 200,
    categoryId: 'CAT001',
    subCategoryId: 'SCAT002',
  },
];

export const orderMock = [
  {
    id: 1,
    orderId: 'ORD001',
    productId: 'PRD001',
    currency: 'USD',
    quantity: 2,
    shippingCost: 10.0,
    amount: 150.0,
    channel: 'Online',
    channelGroup: 'E-commerce',
    campaign: 'Spring Sale',
    dateTime: new Date('2022-03-15T10:00:00Z'),
  },
  {
    id: 2,
    orderId: 'ORD002',
    productId: 'PRD003',
    currency: 'USD',
    quantity: 1,
    shippingCost: 5.0,
    amount: 450.0,
    channel: 'Online',
    channelGroup: 'E-commerce',
    campaign: 'Spring Sale',
    dateTime: new Date('2022-03-16T12:00:00Z'),
  },
];
