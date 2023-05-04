import { productStub } from '../test/stubs/product.stub';

export const ProductService = jest.fn().mockReturnValue({
  getProductById: jest.fn().mockResolvedValue(productStub()),
  getProducts: jest.fn().mockResolvedValue([productStub()]),
  createProduct: jest.fn().mockResolvedValue(productStub()),
  updateProduct: jest.fn().mockResolvedValue(productStub()),
  deleteProductById: jest.fn().mockResolvedValue(productStub()),
});
