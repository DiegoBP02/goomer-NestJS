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
  item1: BusinessHours,
  item2: BusinessHours,
): boolean => {
  const format = 'HH:mm';

  for (
    let i = moment().day(item1.dayOfWeekStart);
    i <= moment().day(item1.dayOfWeekEnd);
    i.add(1, 'days')
  ) {
    const start1 = moment(item1.startTime, format);
    const end1 = moment(item1.endTime, format);
    const start2 = moment(item2.startTime, format);
    const end2 = moment(item2.endTime, format);
    const currentDay = i.format('dddd');

    if (
      currentDay === item2.dayOfWeekStart ||
      currentDay === item2.dayOfWeekEnd
    ) {
      if (currentDay === item2.dayOfWeekStart) {
        start2.hours(moment(item2.startTime, format).hours());
        start2.minutes(moment(item2.startTime, format).minutes());
      }
      if (currentDay === item2.dayOfWeekEnd) {
        end2.hours(moment(item2.endTime, format).hours());
        end2.minutes(moment(item2.endTime, format).minutes());
      }
    } else {
      start2.hours(0);
      start2.minutes(0);
      end2.hours(23);
      end2.minutes(59);
    }

    if (start2.isBetween(start1, end1) || end2.isBetween(start1, end1)) {
      return true;
    }
  }

  return false;
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
