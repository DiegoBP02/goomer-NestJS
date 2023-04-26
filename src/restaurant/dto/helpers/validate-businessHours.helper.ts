import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as moment from 'moment';
import { InvalidBusinessHours } from '../../exceptions/invalid-businesshours.exception';
import { BusinessHours } from 'src/restaurant/schema/restaurant.schema';

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

const isValidTime = (time: string): boolean => {
  return moment(time, 'HH:mm', true).isValid();
};

const checkTimeInterval = (start: string, end: string): boolean => {
  const format = 'HH:mm';
  const diff = moment.duration(moment(start, format).diff(moment(end, format)));
  return Math.abs(diff.asMinutes()) >= 15;
};

const setMomentTime = (day: string, hour: string, minute: string) => {
  return moment()
    .day(day)
    .set('hour', moment(hour, 'HH:mm').hours())
    .set('minute', moment(minute, 'HH:mm').minutes())
    .set('second', 0);
};

const checkForOverlap = (
  item1: BusinessHours,
  item2: BusinessHours,
): boolean => {
  const start1 = setMomentTime(
    item1.dayOfWeekStart,
    item1.startTime,
    item1.startTime,
  );
  const end1 = setMomentTime(item1.dayOfWeekEnd, item1.endTime, item1.endTime);
  const start2 = setMomentTime(
    item2.dayOfWeekStart,
    item2.startTime,
    item2.startTime,
  );
  const end2 = setMomentTime(item2.dayOfWeekEnd, item2.endTime, item2.endTime);

  return start2.isBetween(start1, end1) || end2.isBetween(start1, end1);
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
              'There must be at least a 15 minute interval',
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
