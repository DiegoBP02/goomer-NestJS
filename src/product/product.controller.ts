import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product-dto';
import { Product } from './schema/product.schema';
import { UpdateProductDto } from './dto/update-product-dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  async getProducts(): Promise<Product[]> {
    return this.productService.getProducts();
  }

  @Get('/:id')
  async getProduct(@Param('id') id: string): Promise<Product> {
    console.log('called with id: ', id);
    const product = await this.productService.getProductById(id);
    console.log('ProductController getProduct product', product);
    return product;
  }

  @Patch('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: string): Promise<Product> {
    return this.productService.deleteProductById(id);
  }
}
