import { MiddlewareConsumer, Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantService } from './restaurant.service';
import { Restaurant, RestaurantSchema } from './schema/restaurant.schema';
import { RestaurantRepository } from './restaurant.repository';
import { RestaurantMiddleware } from './middlewares/restaurant-not-found.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService, RestaurantRepository],
})
export class RestaurantModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RestaurantMiddleware).forRoutes('restaurant/:id');
  }
}
