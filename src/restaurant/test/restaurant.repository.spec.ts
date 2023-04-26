import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { FilterQuery } from 'mongoose';
import { RestaurantModel } from './support/restaurant.model';
import { RestaurantRepository } from '../restaurant.repository';
import { Restaurant } from '../schema/restaurant.schema';
import { RestaurantMongoose, restaurantStub } from './stubs/restaurant.stub';

describe('RestaurantRepository', () => {
  let restaurantRepository: RestaurantRepository;

  describe('find operations', () => {
    let restaurantModel: RestaurantModel;
    let restaurantFilterQuery: FilterQuery<RestaurantMongoose>;

    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          RestaurantRepository,
          {
            provide: getModelToken(Restaurant.name),
            useClass: RestaurantModel,
          },
        ],
      }).compile();

      restaurantRepository =
        moduleRef.get<RestaurantRepository>(RestaurantRepository);
      restaurantModel = moduleRef.get<RestaurantModel>(
        getModelToken(Restaurant.name),
      );

      restaurantFilterQuery = {
        _id: restaurantStub()._id,
      };

      jest.clearAllMocks();
    });

    describe('findOne', () => {
      describe('when findOne is called', () => {
        let restaurant: Restaurant;

        beforeEach(async () => {
          jest.spyOn(restaurantModel, 'findOne');
          restaurant = await restaurantRepository.findOne(
            restaurantFilterQuery,
          );
        });

        test('then it should call the restaurantModel', () => {
          expect(restaurantModel.findOne).toHaveBeenCalledWith(
            restaurantFilterQuery,
            {},
          );
        });

        test('then it should return a restaurant', () => {
          expect(restaurant).toEqual(restaurantStub());
        });
      });
    });

    describe('find', () => {
      describe('when find is called', () => {
        let restaurants: Restaurant[];

        beforeEach(async () => {
          jest.spyOn(restaurantModel, 'find');
          restaurants = await restaurantRepository.find(restaurantFilterQuery);
        });

        test('then it should call the restaurantModel', () => {
          expect(restaurantModel.find).toHaveBeenCalledWith(
            restaurantFilterQuery,
          );
        });

        test('then it should return an array of users', () => {
          expect(restaurants).toEqual([restaurantStub()]);
        });
      });
    });

    describe('findOneAndUpdate', () => {
      describe('when findOneAndUpdate is called', () => {
        let restaurant: Restaurant;

        beforeEach(async () => {
          jest.spyOn(restaurantModel, 'findOneAndUpdate');
          restaurant = await restaurantRepository.findOneAndUpdate(
            restaurantFilterQuery,
            restaurantStub(),
          );
        });

        test('then it should call the restaurantModel', () => {
          expect(restaurantModel.findOneAndUpdate).toHaveBeenCalledWith(
            restaurantFilterQuery,
            restaurantStub(),
            { new: true, runValidators: true },
          );
        });

        test('then it should return a restaurant', () => {
          expect(restaurant).toEqual(restaurantStub());
        });
      });
    });

    describe('findOneAndRemove', () => {
      describe('when findOneAndRemove is called', () => {
        let restaurant: Restaurant;

        beforeEach(async () => {
          jest.spyOn(restaurantModel, 'findOneAndRemove');
          restaurant = await restaurantRepository.findOneAndRemove(
            restaurantFilterQuery,
          );
        });

        test('then it should call the restaurantModel', () => {
          expect(restaurantModel.findOneAndRemove).toHaveBeenCalledWith(
            restaurantFilterQuery,
          );
        });

        test('then it should return a restaurant', () => {
          expect(restaurant).toEqual(restaurantStub());
        });
      });
    });
  });

  describe('create operations', () => {
    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          RestaurantRepository,
          {
            provide: getModelToken(Restaurant.name),
            useValue: RestaurantModel,
          },
        ],
      }).compile();

      restaurantRepository =
        moduleRef.get<RestaurantRepository>(RestaurantRepository);
    });

    describe('create', () => {
      describe('when create is called', () => {
        let restaurant: Restaurant;
        let saveSpy: jest.SpyInstance;
        let constructorSpy: jest.SpyInstance;

        beforeEach(async () => {
          saveSpy = jest.spyOn(RestaurantModel.prototype, 'save');
          constructorSpy = jest.spyOn(
            RestaurantModel.prototype,
            'constructorSpy',
          );
          restaurant = await restaurantRepository.create(restaurantStub());
        });

        test('then it should call the userModel', () => {
          expect(saveSpy).toHaveBeenCalled();
          expect(constructorSpy).toHaveBeenCalledWith(restaurantStub());
        });

        test('then it should return a user', () => {
          expect(restaurant).toEqual(restaurantStub());
        });
      });
    });
  });
});
