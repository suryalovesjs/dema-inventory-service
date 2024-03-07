# NestJS GraphQL Prisma SQLite Project with Inventory and Orders

This project is a full-stack web application that establishes an inventory and order system using NestJS, GraphQL, Prisma and SQLite.

## Technologies Used

* [NestJS](https://nestjs.com/): A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
* [GraphQL](https://graphql.org/): A query language for APIs, and a runtime for executing those queries with your existing data.
* [Prisma](https://www.prisma.io/): An open-source database ORM for Node.js and TypeScript.
* [SQLite](https://www.sqlite.org/index.html): SQLite is a C library that provides a lightweight disk-based database.

## Features

* Inventory and Order Management: Add, update, or delete items in inventory and manage orders associated with them.
* Search and filter inventories.
* Pagination and sort features for inventory queries.
* Calculate the number of orders and stock availability status directly from the inventory table.

## How it Works

The program exposes two primary types of operations - `Query` and `Mutation`.

### Queries

#### `getInventories`

Used to retrieve inventory data. It accepts four optional arguments, `search`, `filter`, `pagination` and `sort` to provide more flexibility in fetching inventory data.

### Mutations

#### `createInventory`

Accepts a new inventory item and saves it to the database.

#### `updateInventory`

Updates a single inventory record based on the provided data.

#### `bulkUpdateInventory`

Updates multiple inventory records at once.

#### `deleteInventory`

Deletes an inventory record based on provided ID.

## Resolved Fields

The `Inventory` type has two resolved fields `inStock` and `totalOrders`.

### `inStock`

Resolved as `true` if `quantity > 0`, otherwise `false`.

### `totalOrders`

Returns the total number of orders placed for the particular inventory item.

## Getting Started

Fork/clone this repo to your local system. You need to have Node.js, npm/yarn and SQLite installed on your system. Update the environment variables if necessary before starting the server. Navigate to the project's directory and install dependencies with `npm install`, then run the application using `npm run start:dev`. 

