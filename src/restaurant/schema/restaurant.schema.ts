import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RestaurantDocument = Restaurant & Document;

export type BusinessHours = {
  dayOfWeekStart: string;
  dayOfWeekEnd: string;
  startTime: string;
  endTime: string;
};

@Schema()
export class Restaurant {
  @Prop()
  image: string;

  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop()
  businessHours: BusinessHours[];
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
