import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dto/create-product-dto';
import { Product } from './schema/product.schema';
import { UpdateProductDto } from './dto/update-product-dto';
import { RestaurantRepository } from 'src/restaurant/restaurant.repository';
import { RestaurantController } from 'src/restaurant/restaurant.controller';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly restaurantController: RestaurantController,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.create(createProductDto);
  }

  async getProducts(): Promise<Product[]> {
    return this.productRepository.find({});
  }

  async getProductById(id: string): Promise<Product> {
    return this.productRepository.findOne({ _id: id });
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productRepository.findOneAndUpdate(
      { _id: id },
      updateProductDto,
    );
  }

  async deleteProductById(id: string): Promise<Product> {
    return this.productRepository.findOneAndRemove({ _id: id });
  }
}
