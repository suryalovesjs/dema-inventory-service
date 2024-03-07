# Sample Query Examples

1. **Getting all Inventories with pagination, sort, search and filter**

   ```graphql
   query {
     getInventories(
       search: { name: "High-top sneakers" }
       filter: { category: "Shoes", inStock: true }
       pagination: { page: 1, pageSize: 10 }
       sort: { sortBy: totalOrders, orderBy: desc }
     ) {
       productId
       name
       category {
         name
       }
       orders {
         orderId
       }
       totalOrders
       quantity
     }
   }
   ```

2. **Getting all Inventories that are in Stock**

   ```graphql
   query {
     getInventories(filter: { inStock: true }) {
       productId
       name
       category {
         name
       }
       orders {
         orderId
       }
       totalOrders
       quantity
     }
   }
   ```

3. **Getting all Inventories sorted by totalOrders**

   ```graphql
   query {
     getInventories(sort: { sortBy: totalOrders, orderBy: desc }) {
       totalOrders
       quantity
       productId
       name
       category {
         name
       }
       orders {
         orderId
       }
       quantity
     }
   }
   ```

4. **Find a specific order by ID for a men's waistcoat**

   ```graphql
   query {
     findOrder(orderId: "efb921c1-6733-3811-b4c2-aa0d80800638") {
       orderId
       productId
       amount
     }
   }
   ```

5. **Get all orders**

   ```graphql
   query {
     getOrders {
       orderId
       productId
       currency
       channel
       channelGroup
     }
   }
   ```

6. **Get all categories**

   ```graphql
   query {
     getCategories {
       id
       name
       subCategories {
         name
         id
       }
     }
   }
   ```

# Sample Mutation Examples

1. **Create inventory for a new Dress**

   ```graphql
   mutation {
     createInventory(
       newInventory: {
         name: "Dema Shoes"
         quantity: 5
         categoryId: "6274630c-10a4-4c7d-9b56-e9e92f951ebb"
         subCategoryId: "3fb3f565-2b9c-4088-a797-ba03a88f8c9f"
       }
     ) {
       productId
       name
       category {
         name
       }
       subCategory {
         name
       }
     }
   }
   ```

2. **Update inventory for Slim-fit trousers**

   ```graphql
   mutation {
     updateInventory(
       updateData: {
         productId: "prod1529#prod101021002065"
         name: "Slim-fit trousers"
         quantity: 10
       }
     ) {
       name
       quantity
     }
   }
   ```

3. **Bulk update inventory for two products**

   ```graphql
   mutation {
     bulkUpdateInventory(
       updateData: [
         { productId: "prod1524#prod100051005070", quantity: 15 }
         { productId: "prod1572#prod108001000090", quantity: 20 }
       ]
     ) {
       productId
       quantity
     }
   }
   ```

5. **Create order for a Satin blouse**

   ```graphql
   mutation {
     createOrder(
       orderInput: {
         productId: "prod1524#prod100051005070"
         currency: "USD"
         quantity: 1
         shippingCost: 5.0
         amount: 199.0
         channel: "Online"
         channelGroup: "E-Commerce"
         campaign: "Black Friday"
         dateTime: "2021-11-25T00:00:00Z"
       }
     ) {
       orderId
     }
   }
   ```
