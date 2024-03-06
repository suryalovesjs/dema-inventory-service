import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SubCategory {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;
}
