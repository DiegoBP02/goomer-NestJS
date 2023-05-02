import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as moment from 'moment';
import { InvalidBusinessHours } from '../../exceptions/invalid-businesshours.exception';
import { BusinessHours } from 'src/restaurant/schema/restaurant.schema';

function isValidDayOfWeek(dayOfWeek: string): boolean {
  const weekdays = moment.weekdays();
  return weekdays.includes(dayOfWeek);
}

const isValidTime = (time: string): boolean => {
  return moment(time, 'HH:mm', true).isValid();
};

const checkTimeInterval = (start: string, end: string): boolean => {
  const format = 'HH:mm';
  const diff = moment.duration(moment(start, format).diff(moment(end, format)));
  return Math.abs(diff.asMinutes()) >= 15;
};

const checkForOverlap = (
  businessHours1: BusinessHours,
  businessHours2: BusinessHours,
): boolean => {
  const format = 'HH:mm';

  const start1 = moment(businessHours1.startTime, format);
  const end1 = moment(businessHours1.endTime, format);
  const start2 = moment(businessHours2.startTime, format);
  const end2 = moment(businessHours2.endTime, format);

  const daysOfWeek1 = getDaysOfWeek(
    businessHours1.dayOfWeekStart,
    businessHours1.dayOfWeekEnd,
  );
  const daysOfWeek2 = getDaysOfWeek(
    businessHours2.dayOfWeekStart,
    businessHours2.dayOfWeekEnd,
  );

  if (start2.isBefore(start1) && end2.isAfter(end1)) {
    return true;
  }

  for (const day1 of daysOfWeek1) {
    for (const day2 of daysOfWeek2) {
      if (day1 === day2) {
        if (start2.isBetween(start1, end1) || end2.isBetween(start1, end1)) {
          return true;
        }
      }
    }
  }

  return false;
};

const getDaysOfWeek = (
  dayOfWeekStart: string,
  dayOfWeekEnd: string,
): string[] => {
  const weekdays = moment.weekdays();
  const start = weekdays.indexOf(dayOfWeekStart);
  const end = weekdays.indexOf(dayOfWeekEnd);
  return weekdays.slice(start, end + 1);
};

@ValidatorConstraint()
export class IsValidBusinessHours implements ValidatorConstraintInterface {
  validate(businessHours: BusinessHours[]) {
    for (let i = 0; i < businessHours.length; i++) {
      const item = businessHours[i];

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

      for (let j = i + 1; j < businessHours.length; j++) {
        const currentItem = businessHours[j];
        if (item.dayOfWeekEnd == currentItem.dayOfWeekStart) {
          if (!checkTimeInterval(item.endTime, currentItem.startTime)) {
            throw new InvalidBusinessHours(
              'There must be at least a 15 minute interval!',
            );
          }
        }
        if (checkForOverlap(item, currentItem)) {
          throw new InvalidBusinessHours('Time conflict!');
        }
      }
    }

    return true;
  }
}
