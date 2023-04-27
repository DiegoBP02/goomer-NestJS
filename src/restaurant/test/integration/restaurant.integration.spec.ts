import { Test } from '@nestjs/testing';
import mongoose, { Connection } from 'mongoose';
import * as request from 'supertest';
import { omit } from 'lodash';
import { AppModule } from '../../../app.module';
import { DatabaseService } from '../../../database/database.service';
import { restaurantStub } from '../stubs/restaurant.stub';
import { Restaurant } from 'src/restaurant/schema/restaurant.schema';
import { CreateRestaurantDto } from 'src/restaurant/dto/create-restaurant.dto';
import {
  createRestaurant,
  generateRandomId,
} from './helpers/create-restaurant.help';

describe('RestaurantController', () => {
  let dbConnection: Connection;
  let httpServer: any;
  let app: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await dbConnection.collection('restaurants').deleteMany({});
  });

  describe('getRestaurants', () => {
    it('should return an array of restaurants', async () => {
      await dbConnection
        .collection('restaurants')
        .insertOne(restaurantStub() as Restaurant);
      const res = await request(httpServer).get('/restaurant');

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject([restaurantStub()]);
    });
  });

  describe('createRestaurant', () => {
    it('should create a restaurant', async () => {
      const createRestaurantRequest: CreateRestaurantDto = {
        ...restaurantStub(),
      };
      const res = await request(httpServer)
        .post('/restaurant')
        .send(createRestaurantRequest);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        ...restaurantStub(),
        _id: expect.any(String),
      });

      const restaurant = await dbConnection
        .collection('restaurants')
        .findOne({ name: res.body.name });
      expect(restaurant).toMatchObject(omit(res.body, '_id'));
      expect(restaurant._id).toBeDefined();
    });
    it('should throw invalid business hours', async () => {
      const createRestaurantRequest: CreateRestaurantDto = {
        ...restaurantStub(),
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
            startTime: '15:00',
            endTime: '13:00',
          },
        ],
      };
      const res = await request(httpServer)
        .post('/restaurant')
        .send(createRestaurantRequest);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message:
          'Something went wrong in businessHours property: There must be at least a 15 minute interval',
      });
    });
  });

  describe('getRestaurant', () => {
    it('should return a restaurant', async () => {
      const rest = await createRestaurant(httpServer);

      const res = await request(httpServer).get(`/restaurant/${rest.body._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        ...restaurantStub(),
        _id: rest.body._id,
      });
    });
    it('should throw restaurant not found', async () => {
      const randomId = generateRandomId();
      const res = await request(httpServer).get(`/restaurant/${randomId}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        statusCode: 404,
        message: `Restaurant with ${randomId} not found!`,
      });
    });

    describe('updateRestaurant', () => {
      it('should return a updated restaurant', async () => {
        const rest = await createRestaurant(httpServer);

        const res = await request(httpServer)
          .patch(`/restaurant/${rest.body._id}`)
          .send({ name: 'randomName' });

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          ...restaurantStub(),
          name: 'randomName',
          _id: rest.body._id,
        });
      });
      it('should throw restaurant not found', async () => {
        const randomId = generateRandomId();
        const res = await request(httpServer)
          .patch(`/restaurant/${randomId}`)
          .send({ name: 'randomName' });

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
          statusCode: 404,
          message: `Restaurant with ${randomId} not found!`,
        });
      });
    });

    describe('deleteRestaurant', () => {
      it('should delete a restaurant', async () => {
        const rest = await createRestaurant(httpServer);

        const res = await request(httpServer).delete(
          `/restaurant/${rest.body._id}`,
        );

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          ...restaurantStub(),
          _id: rest.body._id,
        });
      });
      it('should throw restaurant not found', async () => {
        const randomId = generateRandomId();
        const res = await request(httpServer).delete(`/restaurant/${randomId}`);

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
          statusCode: 404,
          message: `Restaurant with ${randomId} not found!`,
        });
      });
    });
  });
});
