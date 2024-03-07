import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Order } from './order';
import { Category } from './category';
import { SubCategory } from './subCategory';
import { SortOptions, SortOrder } from '../constants';

registerEnumType(SortOptions, {
  name: 'SortOptions',
});

registerEnumType(SortOrder, {
  name: 'SortOrder',
});

@ObjectType()
export class Inventory {
  @Field(() => String)
  productId: string;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Category, { nullable: true })
  category: Category;

  @Field(() => SubCategory, { nullable: true })
  subCategory: SubCategory;

  @Field(() => [Order], { nullable: true })
  orders: [Order] | null;
}

@InputType()
export class CreateInventoryInput {
  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => Int, { nullable: false })
  quantity: number;

  @Field(() => String, { nullable: false })
  categoryId: string;

  @Field(() => String, { nullable: false })
  subCategoryId: string | null;
}

@InputType()
export class UpdateInventoryInput {
  @Field(() => String, { nullable: false })
  productId: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  quantity?: number;

  @Field({ nullable: true })
  categoryId?: string;

  @Field({ nullable: true })
  subCategoryId?: string;
}

@InputType()
export class FilterInventoryInput {
  @Field(() => String, { nullable: true })
  category: string;

  @Field(() => String, { nullable: true })
  subCategory: string;

  @Field(() => Boolean, { nullable: true })
  inStock: boolean | null;
}

@InputType()
export class SearchInventoryInput {
  @Field(() => String, { nullable: true })
  name: string;
}

@InputType()
export class InventorySortInput {
  @Field(() => SortOptions, { nullable: true })
  sortBy?: SortOptions;

  @Field(() => SortOrder, { nullable: true })
  orderBy?: SortOrder;
}

@InputType()
export class InventoryPaginationInput {
  @Field({ nullable: true })
  page: number = 1;

  @Field({ nullable: true })
  pageSize: number = 10;
}
