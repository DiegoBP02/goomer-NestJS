import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Restaurant {
  @Prop()
  image: string;

  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop()
  businessHoursStart: string;

  @Prop()
  businessHoursEnd: string;
}

export const UsersSchema = SchemaFactory.createForClass(Restaurant);
