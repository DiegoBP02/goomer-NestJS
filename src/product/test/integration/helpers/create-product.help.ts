import { CreateProductDto } from 'src/product/dto/create-product-dto';
import * as request from 'supertest';
import { productStub } from '../../stubs/product.stub';
import { createRestaurant } from 'src/restaurant/test/integration/helpers/create-restaurant.help';

export const createProduct = async (httpServer: any) => {
  const restaurant = await createRestaurant(httpServer);
  const restaurantId = restaurant.body._id;

  const createProductRequest: CreateProductDto = {
    ...productStub(),
    restaurantId,
  };
  const res = await request(httpServer)
    .post('/product')
    .send(createProductRequest);

  return res;
};
