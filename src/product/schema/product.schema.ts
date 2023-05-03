import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  BusinessHours,
  Restaurant,
} from 'src/restaurant/schema/restaurant.schema';

export type ProductDocument = Product & Document;

export enum Category {
  Entrees = 'entrees',
  Appetizers = 'appetizers',
  Cocktails = 'cocktails',
  Desserts = 'desserts',
  Breakfast = 'breakfast',
}

export type Sale = {
  description: string;
  promotionalPrice: number;
  timeOnSale: BusinessHours;
};

@Schema()
export class Product {
  @Prop()
  image: string;

  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop({ enum: Category })
  category: string;

  @Prop()
  sale: Sale[];

  @Prop({ type: Types.ObjectId, ref: Restaurant.name })
  restaurantId: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
