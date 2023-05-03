import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { FilterQuery } from 'mongoose';
import { ProductRepository } from '../product.repository';
import { ProductModel } from './support/product.model';
import { ProductMongoose, productStub } from './stubs/product.stub';
import { Product } from '../schema/product.schema';

describe('ProductRepository', () => {
  let productRepository: ProductRepository;

  describe('find operations', () => {
    let productModel: ProductModel;
    let productFilterQuery: FilterQuery<ProductMongoose>;

    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          ProductRepository,
          {
            provide: getModelToken(Product.name),
            useClass: ProductModel,
          },
        ],
      }).compile();

      productRepository = moduleRef.get<ProductRepository>(ProductRepository);
      productModel = moduleRef.get<ProductModel>(getModelToken(Product.name));

      productFilterQuery = {
        _id: productStub()._id,
      };

      jest.clearAllMocks();
    });

    describe('findOne', () => {
      describe('when findOne is called', () => {
        let product: Product;

        beforeEach(async () => {
          jest.spyOn(productModel, 'findOne');
          product = await productRepository.findOne(productFilterQuery);
        });

        test('then it should call the productModel', () => {
          expect(productModel.findOne).toHaveBeenCalledWith(productFilterQuery);
        });

        test('then it should return a product', () => {
          expect(product).toEqual(productStub());
        });
      });
    });

    describe('find', () => {
      describe('when find is called', () => {
        let products: Product[];

        beforeEach(async () => {
          jest.spyOn(productModel, 'find');
          products = await productRepository.find(productFilterQuery);
        });

        test('then it should call the productModel', () => {
          expect(productModel.find).toHaveBeenCalledWith(productFilterQuery);
        });

        test('then it should return an array of products', () => {
          expect(products).toEqual([productStub()]);
        });
      });
    });

    describe('findOneAndUpdate', () => {
      describe('when findOneAndUpdate is called', () => {
        let product: Product;

        beforeEach(async () => {
          jest.spyOn(productModel, 'findOneAndUpdate');
          product = await productRepository.findOneAndUpdate(
            productFilterQuery,
            productStub(),
          );
        });

        test('then it should call the productModel', () => {
          expect(productModel.findOneAndUpdate).toHaveBeenCalledWith(
            productFilterQuery,
            productStub(),
            { new: true, runValidators: true },
          );
        });

        test('then it should return a product', () => {
          expect(product).toEqual(productStub());
        });
      });
    });

    describe('findOneAndRemove', () => {
      describe('when findOneAndRemove is called', () => {
        let product: Product;

        beforeEach(async () => {
          jest.spyOn(productModel, 'findOneAndRemove');
          product = await productRepository.findOneAndRemove(
            productFilterQuery,
          );
        });

        test('then it should call the productModel', () => {
          expect(productModel.findOneAndRemove).toHaveBeenCalledWith(
            productFilterQuery,
          );
        });

        test('then it should return a product', () => {
          expect(product).toEqual(productStub());
        });
      });
    });
  });

  describe('create operations', () => {
    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          ProductRepository,
          {
            provide: getModelToken(Product.name),
            useValue: ProductModel,
          },
        ],
      }).compile();

      productRepository = moduleRef.get<ProductRepository>(ProductRepository);
    });

    describe('create', () => {
      describe('when create is called', () => {
        let product: Product;
        let saveSpy: jest.SpyInstance;
        let constructorSpy: jest.SpyInstance;

        beforeEach(async () => {
          saveSpy = jest.spyOn(ProductModel.prototype, 'save');
          constructorSpy = jest.spyOn(ProductModel.prototype, 'constructorSpy');
          product = await productRepository.create(productStub());
        });

        test('then it should call the productModel', () => {
          expect(saveSpy).toHaveBeenCalled();
          expect(constructorSpy).toHaveBeenCalledWith(productStub());
        });

        test('then it should return a product', () => {
          expect(product).toEqual(productStub());
        });
      });
    });
  });
});
