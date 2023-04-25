import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { EntityRepository } from '../database/entity.repository';

import { Restaurant, RestaurantDocument } from './schema/restaurant.schema';

@Injectable()
export class RestaurantRepository extends EntityRepository<RestaurantDocument> {
  constructor(
    @InjectModel(Restaurant.name) restaurantModel: Model<RestaurantDocument>,
  ) {
    super(restaurantModel);
  }
}
