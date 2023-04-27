import { CreateRestaurantDto } from 'src/restaurant/dto/create-restaurant.dto';
import { restaurantStub } from '../../stubs/restaurant.stub';
import * as request from 'supertest';
import mongoose from 'mongoose';

export const createRestaurant = async (httpServer: any) => {
  const createRestaurantRequest: CreateRestaurantDto = {
    ...restaurantStub(),
  };
  const res = await request(httpServer)
    .post('/restaurant')
    .send(createRestaurantRequest);
  return res;
};

export const generateRandomId = (): string => {
  const randomId = new mongoose.Types.ObjectId();
  return randomId.toString();
};
