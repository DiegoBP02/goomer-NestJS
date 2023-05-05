import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { omit } from 'lodash';
import { AppModule } from '../../../app.module';
import { DatabaseService } from '../../../database/database.service';
import { productStub } from '../stubs/product.stub';
import { CreateProductDto } from 'src/product/dto/create-product-dto';
import { createProduct } from 'src/product/test/integration/helpers/create-product.help';
import {
  createRestaurant,
  generateRandomId,
} from 'src/restaurant/test/integration/helpers/create-restaurant.help';

describe('ProductIntegration', () => {
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
    await dbConnection.collection('products').deleteMany({});
    await dbConnection.collection('restaurants').deleteMany({});
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const restaurant = await createRestaurant(httpServer);
      const restaurantId = restaurant.body._id;

      const createProductRequest: CreateProductDto = {
        ...productStub(),
        restaurantId,
      };
      const res = await request(httpServer)
        .post('/product')
        .send(createProductRequest);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        ...productStub(),
        _id: expect.any(String),
        restaurantId,
      });

      const product = await dbConnection
        .collection('products')
        .findOne({ name: res.body.name });
      expect(product).toMatchObject(omit(res.body, '_id'));
      expect(product._id).toBeDefined();
    });
  });

  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const prod = await createProduct(httpServer);

      const res = await request(httpServer).get('/product');

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject([prod.body]);
    });
  });

  describe('getProduct', () => {
    it('should return a product', async () => {
      const prod = await createProduct(httpServer);

      const res = await request(httpServer).get(`/product/${prod.body._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        ...productStub(),
        _id: prod.body._id,
        restaurantId: prod.body.restaurantId,
      });
    });
    it('should throw product not found', async () => {
      const randomId = generateRandomId();
      const res = await request(httpServer).get(`/product/${randomId}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        statusCode: 404,
        message: `Product with ${randomId} not found!`,
      });
    });
  });
  describe('updateProduct', () => {
    it('should return a updated product', async () => {
      const prod = await createProduct(httpServer);

      const res = await request(httpServer)
        .patch(`/product/${prod.body._id}`)
        .send({ name: 'randomName' });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        ...productStub(),
        name: 'randomName',
        _id: prod.body._id,
        restaurantId: prod.body.restaurantId,
      });
    });
    it('should throw product not found', async () => {
      const randomId = generateRandomId();
      const res = await request(httpServer)
        .patch(`/product/${randomId}`)
        .send({ name: 'randomName' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        statusCode: 404,
        message: `Product with ${randomId} not found!`,
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const prod = await createProduct(httpServer);

      const res = await request(httpServer).delete(`/product/${prod.body._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        ...productStub(),
        _id: prod.body._id,
        restaurantId: prod.body.restaurantId,
      });
    });
    it('should throw product not found', async () => {
      const randomId = generateRandomId();
      const res = await request(httpServer).delete(`/product/${randomId}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        statusCode: 404,
        message: `Product with ${randomId} not found!`,
      });
    });
  });
});
