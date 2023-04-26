import { Test } from '@nestjs/testing';
import { Restaurant } from '../schema/restaurant.schema';
import { RestaurantController } from '../restaurant.controller';
import { RestaurantService } from '../restaurant.service';
import { restaurantStub } from './stubs/restaurant.stub';
import { CreateRestaurantDto } from '../dto/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dto/update-restaurant.dto';

jest.mock('../restaurant.service');

describe('UsersController', () => {
  let restaurantController: RestaurantController;
  let restaurantService: RestaurantService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [RestaurantController],
      providers: [RestaurantService],
    }).compile();

    restaurantController =
      moduleRef.get<RestaurantController>(RestaurantController);
    restaurantService = moduleRef.get<RestaurantService>(RestaurantService);
    jest.clearAllMocks();
  });

  describe('getRestaurant', () => {
    describe('when getRestaurant is called', () => {
      let restaurant: Restaurant;

      beforeEach(async () => {
        restaurant = await restaurantController.getRestaurant(
          restaurantStub()._id,
        );
      });

      test('then it should call restaurantService', () => {
        expect(restaurantService.getRestaurantById).toBeCalledWith(
          restaurantStub()._id,
        );
      });

      test('then is should return a restaurant', () => {
        expect(restaurant).toEqual(restaurantStub());
      });
    });
  });

  describe('getUsers', () => {
    describe('when getUsers is called', () => {
      let restaurants: Restaurant[];

      beforeEach(async () => {
        restaurants = await restaurantController.getRestaurants();
      });

      test('then it should call restaurantService', () => {
        expect(restaurantService.getRestaurants).toHaveBeenCalled();
      });

      test('then it should return restaurants', () => {
        expect(restaurants).toEqual([restaurantStub()]);
      });
    });
  });

  describe('createRestaurant', () => {
    describe('when createRestaurant is called', () => {
      let restaurant: Restaurant;
      let createRestaurantDto: CreateRestaurantDto;

      beforeEach(async () => {
        createRestaurantDto = {
          ...restaurantStub(),
        };
        restaurant = await restaurantController.createRestaurant(
          createRestaurantDto,
        );
      });

      test('then it should call restaurantService', () => {
        expect(restaurantService.createRestaurant).toHaveBeenCalledWith({
          ...restaurantStub(),
        });
      });

      test('then it should return a restaurant', () => {
        expect(restaurant).toEqual(restaurantStub());
      });
    });
  });

  describe('updateRestaurant', () => {
    describe('when updateUser is called', () => {
      let restaurant: Restaurant;
      let updateRestaurantDto: UpdateRestaurantDto;

      beforeEach(async () => {
        updateRestaurantDto = {
          name: 'test name',
          address: 'test address ',
        };
        restaurant = await restaurantController.updateRestaurant(
          restaurantStub()._id,
          updateRestaurantDto,
        );
      });

      test('then it should call restaurantService', () => {
        expect(restaurantService.updateRestaurant).toHaveBeenCalledWith(
          restaurantStub()._id,
          updateRestaurantDto,
        );
      });

      test('then it should return a restaurant', () => {
        expect(restaurant).toEqual(restaurantStub());
      });
    });
  });

  describe('deleteRestaurant', () => {
    describe('when deleteRestaurant is called', () => {
      let restaurant: Restaurant;

      beforeEach(async () => {
        restaurant = await restaurantController.deleteRestaurant(
          restaurantStub()._id,
        );
      });

      test('then it should call restaurantService', () => {
        expect(restaurantService.deleteRestaurantById).toHaveBeenCalled();
      });

      test('then it should return restaurant', () => {
        expect(restaurant).toEqual(restaurantStub());
      });
    });
  });
});
