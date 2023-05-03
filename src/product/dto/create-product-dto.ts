import {
  IsString,
  MaxLength,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsMongoId,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Category, Sale } from '../schema/product.schema';
import { Types } from 'mongoose';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly image: string;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly price: number;

  @IsNotEmpty()
  @IsEnum(Category)
  readonly category: Category;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  readonly sale: Sale[];

  @IsMongoId()
  readonly restaurantId: Types.ObjectId;
}
