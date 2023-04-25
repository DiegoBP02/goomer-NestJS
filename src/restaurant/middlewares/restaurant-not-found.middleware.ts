import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RestaurantRepository } from '../restaurant.repository';
import { RestaurantNotFound } from '../exceptions/restaurant-not-found.exception';

@Injectable()
export class RestaurantMiddleware implements NestMiddleware {
  constructor(private readonly restaurantRepository: RestaurantRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const restaurant = await this.restaurantRepository.findOne({ _id: id });

    if (!restaurant) {
      throw new RestaurantNotFound(id);
    }

    next();
  }
}
