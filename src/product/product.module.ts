import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { ProductRepository } from './product.repository';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { ProductMiddleware } from './middlewares/product-not-found.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    RestaurantModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProductMiddleware).forRoutes('product/:id');
  }
}
