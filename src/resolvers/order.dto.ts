import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Inventory } from './inventory.dto';

@ObjectType()
export class Order {
  @Field(() => String)
  orderId: string;

  @Field(() => String)
  productId: string;

  @Field(() => String)
  currency: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  shippingCost: number;

  @Field(() => Float)
  amount: number;

  @Field(() => String)
  channel: string;

  @Field(() => String)
  channelGroup: string;

  @Field(() => String)
  campaign: string;

  @Field(() => String)
  dateTime: Date;

  @Field(() => Inventory, { nullable: true })
  product?: Inventory | null;
}
