import { Field, ObjectType } from '@nestjs/graphql';
import { SubCategory } from './subCategory';

@ObjectType()
export class Category {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => [SubCategory])
  subCategories: [SubCategory];
}
