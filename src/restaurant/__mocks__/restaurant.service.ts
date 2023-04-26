import { restaurantStub } from '../test/stubs/restaurant.stub';

export const RestaurantService = jest.fn().mockReturnValue({
  getRestaurantById: jest.fn().mockResolvedValue(restaurantStub()),
  getRestaurants: jest.fn().mockResolvedValue([restaurantStub()]),
  createRestaurant: jest.fn().mockResolvedValue(restaurantStub()),
  updateRestaurant: jest.fn().mockResolvedValue(restaurantStub()),
  deleteRestaurantById: jest.fn().mockResolvedValue(restaurantStub()),
});
