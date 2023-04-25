import {
  IsString,
  MaxLength,
  IsNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
  Validate,
} from 'class-validator';
import { BusinessHours } from '../schema/restaurant.schema';
import { IsValidBusinessHours } from './helpers/validate-businessHours.helper';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  readonly image: string;

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  readonly address: string;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @Validate(IsValidBusinessHours)
  readonly businessHours: BusinessHours[];
}
