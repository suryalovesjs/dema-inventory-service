import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Order } from './order.dto';

@ObjectType()
export class Inventory {
  @Field(() => String)
  productId: string;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => String)
  category: string;

  @Field(() => String)
  subCategory: string;

  @Field(() => [Order], { nullable: true })
  orders?: [Order] | null;
}
