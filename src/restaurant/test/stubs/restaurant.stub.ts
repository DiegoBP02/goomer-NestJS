import { Restaurant } from 'src/restaurant/schema/restaurant.schema';

export interface RestaurantMongoose extends Restaurant {
  _id: string;
  __v: number;
}

export const restaurantStub = (): RestaurantMongoose => {
  return {
    image: 'https://example.com/restaurant.jpg',
    name: 'Example Restaurant 2',
    address: '123 Main St, Anytown USA',
    businessHours: [
      {
        dayOfWeekStart: 'Monday',
        dayOfWeekEnd: 'Thursday',
        startTime: '06:00',
        endTime: '15:00',
      },
      {
        dayOfWeekStart: 'Thursday',
        dayOfWeekEnd: 'Sunday',
        startTime: '16:00',
        endTime: '19:00',
      },
    ],
    _id: '644897a7bb8f1b6b471dc1cd',
    __v: 0,
  };
};
