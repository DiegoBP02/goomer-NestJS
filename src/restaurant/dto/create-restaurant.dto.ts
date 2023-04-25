import {
  IsString,
  MaxLength,
  IsNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BusinessHours } from '../schema/restaurant.schema';
import * as moment from 'moment';
import { InvalidBusinessHours } from '../exceptions/invalid-businesshours.exception';

function isValidDayOfWeek(dayOfWeek: string): boolean {
  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  return daysOfWeek.includes(dayOfWeek);
}

function isValidTime(time: string): boolean {
  return moment(time, 'HH:mm', true).isValid();
}

function checkTimeInterval(start: string, end: string): boolean {
  const format = 'HH:mm';
  const diff = moment.duration(moment(start, format).diff(moment(end, format)));
  return diff.asMinutes() >= 15 ? true : false;
}

@ValidatorConstraint()
export class IsValidBusinessHours implements ValidatorConstraintInterface {
  validate(businessHours: BusinessHours[]) {
    for (const item of businessHours) {
      if (item.dayOfWeekStart && !isValidDayOfWeek(item.dayOfWeekStart)) {
        throw new InvalidBusinessHours(item.dayOfWeekStart);
      }
      if (item.dayOfWeekEnd && !isValidDayOfWeek(item.dayOfWeekEnd)) {
        throw new InvalidBusinessHours(item.dayOfWeekEnd);
      }
      if (item.startTime && !isValidTime(item.startTime)) {
        throw new InvalidBusinessHours(item.startTime);
      }
      if (item.endTime && !isValidTime(item.endTime)) {
        throw new InvalidBusinessHours(item.endTime);
      }
      if (!checkTimeInterval) {
        throw new InvalidBusinessHours(
          'There must be at least a 15 minute interval',
        );
      }
    }
    return true;
  }
}

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
