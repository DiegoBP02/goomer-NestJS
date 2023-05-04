import { Test } from '@nestjs/testing';
import { Product } from '../schema/product.schema';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { productStub } from './stubs/product.stub';
import { CreateProductDto } from '../dto/create-product-dto';
import { UpdateProductDto } from '../dto/update-product-dto';

jest.mock('../product.service');

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [ProductController],
      providers: [ProductService],
    }).compile();

    productController = moduleRef.get<ProductController>(ProductController);
    productService = moduleRef.get<ProductService>(ProductService);
    jest.clearAllMocks();
  });

  describe('getProduct', () => {
    describe('when getProduct is called', () => {
      let product: Product;

      beforeEach(async () => {
        product = await productController.getProduct(productStub()._id);
      });

      test('then it should call productService', () => {
        expect(productService.getProductById).toBeCalledWith(productStub()._id);
      });

      test('then is should return a product', () => {
        expect(product).toEqual(productStub());
      });
    });
  });

  describe('getProducts', () => {
    describe('when getProducts is called', () => {
      let products: Product[];

      beforeEach(async () => {
        products = await productController.getProducts();
      });

      test('then it should call productService', () => {
        expect(productService.getProducts).toHaveBeenCalled();
      });

      test('then it should return products', () => {
        expect(products).toEqual([productStub()]);
      });
    });
  });

  describe('createProduct', () => {
    describe('when createProduct is called', () => {
      let product: Product;
      let createProductDto: CreateProductDto;

      beforeEach(async () => {
        createProductDto = {
          ...productStub(),
        };
        product = await productController.createProduct(createProductDto);
      });

      test('then it should call productService', () => {
        expect(productService.createProduct).toHaveBeenCalledWith({
          ...productStub(),
        });
      });

      test('then it should return a product', () => {
        expect(product).toEqual(productStub());
      });
    });
  });

  describe('updateProduct', () => {
    describe('when updateProduct is called', () => {
      let product: Product;
      let updateProductDto: UpdateProductDto;

      beforeEach(async () => {
        updateProductDto = {
          name: 'test name',
        };
        product = await productController.updateProduct(
          productStub()._id,
          updateProductDto,
        );
      });

      test('then it should call productService', () => {
        expect(productService.updateProduct).toHaveBeenCalledWith(
          productStub()._id,
          updateProductDto,
        );
      });

      test('then it should return a product', () => {
        expect(product).toEqual(productStub());
      });
    });
  });

  describe('deleteProduct', () => {
    describe('when deleteProduct is called', () => {
      let product: Product;

      beforeEach(async () => {
        product = await productController.deleteProduct(productStub()._id);
      });

      test('then it should call productService', () => {
        expect(productService.deleteProductById).toHaveBeenCalled();
      });

      test('then it should return product', () => {
        expect(product).toEqual(productStub());
      });
    });
  });
});
