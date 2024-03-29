# Dema Inventory Service
Managing inventories & orders!

## Examples
Find example queries in `EXAMPLES.md`

## Installation

```bash
$ npm install
```

## Database Preparation

```bash
# Seeding
$ npm run db:migrate

```

## Running the app

```bash
# Choose
$ npm run start

# development
$ npm run start:dev

# debug mode
$ npm run start:debug

# production mode
$ npm run build
$ npm run start:prod
```

`Open http://localhost:3000/graphql in your browser`

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Technologies Used

* [NestJS](https://nestjs.com/): A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
* [GraphQL](https://graphql.org/): A query language for APIs, and a runtime for executing those queries with your existing data.
* [Prisma](https://www.prisma.io/): An open-source database ORM for Node.js and TypeScript.
* [SQLite](https://www.sqlite.org/index.html): SQLite is a C library that provides a lightweight disk-based database.

## Features

* Inventory and Order Management: Add, update, bulkUpdate items in inventory.
* Search and filter inventories.
* Sort by quantity or by total orders
* Search for inventory in stock!
* Pagination and sort features for inventory queries.
* Add categories & sub-categories for the inventories.

## How it Works

The program exposes two primary types of operations - `Query` and `Mutation`.

## Inventories

### Queries

#### `getInventories`

Used to retrieve inventory data. It accepts four optional arguments, `search`, `filter`, `pagination` and `sort` to provide more flexibility in fetching inventory data.
`order` is a related data that can be fetch along with them. 

### Mutations

#### `createInventory`

Accepts a new inventory item and saves it to the database.

#### `updateInventory`

Updates a single inventory record based on the provided data.

#### `bulkUpdateInventory`

Updates multiple inventory records at once.


## Resolved Fields

The `Inventory` type has two resolved fields `inStock` and `totalOrders`.

### `inStock`

Resolved as `true` if `quantity > 0`, otherwise `false`.

### `totalOrders`

Returns the total number of orders placed for the particular inventory item.

## Orders

### Queries

#### `getOrders`

Used to fetch a list of orders. It allows the user to utilize pagination via `skip` and `take` arguments.

#### `findOrder`

Allows the retrieval of an order by its `orderId`.

### Mutations

#### `createOrder`

Accepts an `orderInput` to create and save a new order into the database.

# Things that can be covered with more time

* Improved error handling
* Improved data validation
* Accounting the quantity under each orders and to determine the stock availability
* Options to fulfill orders
* Create new order type to categorise purchase orders vs return orders and adjust inventory accordingly
* E2E / Integration tests will synthetic data in a docker container
* Increased test coverage
* Remove product from Inventory and flag the associated orders as invalidated orders


